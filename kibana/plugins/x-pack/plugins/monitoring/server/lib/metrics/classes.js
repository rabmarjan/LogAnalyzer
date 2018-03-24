import _ from 'lodash';
import { MissingRequiredError } from '../error_missing_required';
import {
  LARGE_FLOAT, SMALL_FLOAT, SMALL_BYTES, LARGE_BYTES
} from '../../../common/formatting';

/**
 * Calculate the latency, if any, for the {@code timeInMillis} and {@code timeTotal}.
 *
 * @param  {Number} timeInMillis {@code null} if unknown.
 * @param  {Number} timeTotal    {@code null} if unknown.
 * @return {Number}              {@code null} if unknown.
 */
function calculateLatency(timeInMillis, timeTotal) {
  if (timeInMillis === null || timeTotal === null) {
    return null;
  } else if (timeInMillis < 0 || timeTotal < 0) {
    // Negative values indicate blips in the data (e.g., restarting a node) that we do not want to misrepresent
    return null;
  } else if (timeTotal === 0) {
    return 0;
  }

  return timeInMillis / timeTotal;
}

export class Metric {

  constructor(opts) {
    // apply defaults
    const props = {
      derivative: false
    };

    const requireds = {
      field: opts.field,
      label: opts.label,
      description: opts.description,
      format: opts.format,
      units: opts.units,
      timestampField: opts.timestampField
    };

    const undefKey = _.findKey(requireds, _.isUndefined);
    if (undefKey) {
      console.log(`Missing required field: [${undefKey}]`);
      throw new MissingRequiredError(undefKey);
    }

    _.assign(this, _.defaults(opts, props));
  }

  toPlainObject() {
    return _.toPlainObject(this);
  }

}

export class ElasticsearchMetric extends Metric {

  constructor(opts) {
    super({
      ...opts,
      app: 'elasticsearch',
      uuidField: 'source_node.uuid',
      timestampField: 'timestamp'
    });

    if (_.isUndefined(this.type)) {
      throw new MissingRequiredError('type');
    }
  }

  // helper method
  static getMetricFields() {
    return {
      timestampField: 'timestamp',
      uuidField: 'source_node.uuid',
    };
  }
}

export class KibanaMetric extends Metric {

  constructor(opts) {
    super({
      ...opts,
      app: 'kibana',
      uuidField: 'kibana_stats.kibana.uuid',
      timestampField: 'kibana_stats.timestamp'
    });
  }

}

export class LatencyMetric extends ElasticsearchMetric {

  constructor(opts) {
    super({
      ...opts,
      format: LARGE_FLOAT,
      metricAgg: 'sum',
      units: 'ms'
    });

    const missingRequiredParam = (param) => { throw new MissingRequiredError(param); };
    const metric = this.metric || missingRequiredParam('metric'); // "index" or "query"
    const fieldSource = this.fieldSource || missingRequiredParam('fieldSource');
    delete this.metric;
    delete this.fieldSource;

    const metricField = (metric === 'index') ? 'indexing.index' : 'search.query';

    this.aggs = {
      [`${metric}_time_in_millis`]: {
        max: { field: `${fieldSource}.${metricField}_time_in_millis` }
      },
      [`${metric}_total`]: {
        max: { field: `${fieldSource}.${metricField}_total` }
      },
      [`${metric}_time_in_millis_deriv`]: {
        derivative: { buckets_path: `${metric}_time_in_millis`, gap_policy: 'skip' }
      },
      [`${metric}_total_deriv`]: {
        derivative: { buckets_path: `${metric}_total`, gap_policy: 'skip' }
      }
    };

    this.calculation = (last) => {
      const timeInMillis = _.get(last, `${metric}_time_in_millis_deriv.value`, null);
      const timeTotal = _.get(last, `${metric}_total_deriv.value`, null);

      return calculateLatency(timeInMillis, timeTotal);
    };
  }

}

export class QuotaMetric extends Metric {

  constructor(opts) {
    super({
      ...opts,
      format: LARGE_FLOAT,
      metricAgg: 'max', // makes an average metric of `this.field`, which is the "actual cpu utilization"
      units: '%'
    });

    this.aggs = {
      usage: {
        max: { field: `${this.fieldSource}.${this.usageField}` }
      },
      periods: {
        max: { field: `${this.fieldSource}.${this.periodsField}` }
      },
      quota: {
        // Use min for this value. Basically equivalient to max, but picks -1
        // as the value if quota is disabled in one of the docs, which affects
        // the logic by routing to the non-quota scenario
        min: {
          field: `${this.fieldSource}.${this.quotaField}`
        }
      },
      usage_deriv: {
        derivative: { buckets_path: 'usage', gap_policy: 'skip' }
      },
      periods_deriv: {
        derivative: { buckets_path: 'periods', gap_policy: 'skip' }
      },
    };

    this.calculation = (bucket) => {

      const quota = _.get(bucket, 'quota.value');
      const deltaUsage = _.get(bucket, 'usage_deriv.value');
      const deltaPeriods = _.get(bucket, 'periods_deriv.value');

      if (deltaUsage && deltaPeriods && quota > 0) {
        // if throttling is configured
        const factor = deltaUsage / (deltaPeriods * quota * 1000); // convert quota from microseconds to nanoseconds by multiplying 1000
        return factor * 100; // convert factor to percentage

      }
      // if throttling is NOT configured, show nothing. The user should see that something is not configured correctly
      return null;

    };
  }

}

export class RequestRateMetric extends ElasticsearchMetric {

  constructor(opts) {
    super({
      ...opts,
      derivative: true,
      format: LARGE_FLOAT,
      metricAgg: 'max',
      units: '/s'
    });
  }

}

export class ThreadPoolQueueMetric extends ElasticsearchMetric {

  constructor(opts) {
    super({
      ...opts,
      title: 'Thread Queue',
      type: 'node',
      format: SMALL_FLOAT,
      metricAgg: 'max',
      units: ''
    });
  }

}

export class ThreadPoolRejectedMetric extends ElasticsearchMetric {

  constructor(opts) {
    super({
      ...opts,
      title: 'Thread Rejections',
      type: 'node',
      derivative: true,
      format: SMALL_FLOAT,
      metricAgg: 'max',
      units: ''
    });
  }

}

/**
 * A generic {@code class} for collecting Index Memory metrics.
 *
 * @see IndicesMemoryMetric
 * @see NodeIndexMemoryMetric
 * @see SingleIndexMemoryMetric
 */
export class IndexMemoryMetric extends ElasticsearchMetric {

  constructor(opts) {
    super({
      title: 'Index Memory',
      ...opts,
      format: SMALL_BYTES,
      metricAgg: 'max',
      units: 'B'
    });
  }

}

export class NodeIndexMemoryMetric extends IndexMemoryMetric {

  constructor(opts) {
    super({
      ...opts,
      type: 'node'
    });

    // override the field set by the super constructor
    this.field = 'node_stats.indices.segments.' + opts.field;
  }

}

export class IndicesMemoryMetric extends IndexMemoryMetric {

  constructor(opts) {
    super({
      ...opts,
      type: 'cluster'
    });

    // override the field set by the super constructor
    this.field = 'index_stats.total.segments.' + opts.field;
  }

}

export class SingleIndexMemoryMetric extends IndexMemoryMetric {

  constructor(opts) {
    super({
      ...opts,
      type: 'index'
    });

    // override the field set by the super constructor
    this.field = 'index_stats.total.segments.' + opts.field;
  }

}

export class LogstashMetric extends Metric {

  constructor(opts) {
    super({
      app: 'logstash',
      uuidField: 'logstash_stats.logstash.uuid',
      timestampField: 'logstash_stats.timestamp',
      ...opts
    });
  }

}

export class LogstashClusterMetric extends Metric {

  constructor(opts) {
    super({
      ...opts,
      app: 'logstash',
      timestampField: 'logstash_stats.timestamp'
    });
  }

  // helper method
  static getMetricFields() {
    return {
      timestampField: 'logstash_stats.timestamp'
    };
  }
}

export class LogstashEventsLatencyMetric extends LogstashMetric {

  constructor(opts) {
    super({
      ...opts,
      format: LARGE_FLOAT,
      metricAgg: 'sum',
      units: 'ms'
    });

    this.aggs = {
      events_time_in_millis: {
        max: { field: 'logstash_stats.events.duration_in_millis' }
      },
      events_total: {
        max: { field: 'logstash_stats.events.out' }
      },
      events_time_in_millis_deriv: {
        derivative: { buckets_path: 'events_time_in_millis', gap_policy: 'skip' }
      },
      events_total_deriv: {
        derivative: { buckets_path: 'events_total', gap_policy: 'skip' }
      }
    };

    this.calculation = (last) => {
      const timeInMillis = _.get(last, 'events_time_in_millis_deriv.value', null);
      const timeTotal = _.get(last, 'events_total_deriv.value', null);

      return calculateLatency(timeInMillis, timeTotal);
    };
  }

}

export class LogstashEventsLatencyClusterMetric extends LogstashClusterMetric {

  constructor(opts) {
    super({
      ...opts,
      format: LARGE_FLOAT,
      metricAgg: 'max',
      units: 'ms'
    });

    this.aggs = {
      logstash_uuids: {
        terms: {
          field: 'logstash_stats.logstash.uuid',
          size: 1000
        },
        aggs: {
          events_time_in_millis_per_node: {
            max: {
              field: 'logstash_stats.events.duration_in_millis'
            }
          },
          events_total_per_node: {
            max: {
              field: 'logstash_stats.events.out'
            }
          }
        }
      },
      events_time_in_millis: {
        sum_bucket: {
          buckets_path: 'logstash_uuids>events_time_in_millis_per_node',
          gap_policy: 'skip'
        }
      },
      events_total: {
        sum_bucket: {
          buckets_path: 'logstash_uuids>events_total_per_node',
          gap_policy: 'skip'
        }
      },
      events_time_in_millis_deriv: {
        derivative: { buckets_path: 'events_time_in_millis', gap_policy: 'skip' }
      },
      events_total_deriv: {
        derivative: { buckets_path: 'events_total', gap_policy: 'skip' }
      }
    };

    this.calculation = (last) => {
      const timeInMillis = _.get(last, 'events_time_in_millis_deriv.value', null);
      const timeTotal = _.get(last, 'events_total_deriv.value', null);

      return calculateLatency(timeInMillis, timeTotal);
    };
  }

}

export class LogstashEventsRateMetric extends LogstashMetric {

  constructor(opts) {
    super({
      ...opts,
      derivative: true,
      format: LARGE_FLOAT,
      metricAgg: 'max',
      units: '/s'
    });
  }

}

export class LogstashEventsRateClusterMetric extends LogstashClusterMetric {

  constructor(opts) {
    super({
      ...opts,
      derivative: true,
      format: LARGE_FLOAT,
      metricAgg: 'max',
      units: '/s'
    });

    this.aggs = {
      logstash_uuids: {
        terms: {
          field: 'logstash_stats.logstash.uuid',
          size: 1000
        },
        aggs: {
          event_rate_per_node: {
            max: {
              field: this.field
            }
          }
        }
      },
      event_rate: {
        sum_bucket: {
          buckets_path: 'logstash_uuids>event_rate_per_node',
          gap_policy: 'skip'
        }
      },
      metric_deriv: {
        derivative: { buckets_path: 'event_rate', gap_policy: 'skip' }
      }
    };
  }

}

export class LogstashPipelineThroughputMetric extends LogstashMetric {
  constructor(opts) {
    super({
      ...opts,
      derivative: false
    });

    this.dateHistogramSubAggs = {
      pipelines_nested: {
        nested: {
          path: 'logstash_stats.pipelines'
        },
        aggs: {
          by_pipeline_id: {
            terms: {
              field: 'logstash_stats.pipelines.id',
              size: 1000
            },
            aggs: {
              throughput: {
                sum_bucket: {
                  buckets_path: 'by_pipeline_hash>throughput'
                }
              },
              by_pipeline_hash: {
                terms: {
                  field: 'logstash_stats.pipelines.hash',
                  size: 1000
                },
                aggs: {
                  throughput: {
                    sum_bucket: {
                      buckets_path: 'by_ephemeral_id>throughput'
                    }
                  },
                  by_ephemeral_id: {
                    terms: {
                      field: 'logstash_stats.pipelines.ephemeral_id',
                      size: 1000
                    },
                    aggs: {
                      events_stats: {
                        stats: {
                          field: this.field
                        }
                      },
                      throughput: {
                        bucket_script: {
                          script: 'params.max - params.min',
                          buckets_path: {
                            min: 'events_stats.min',
                            max: 'events_stats.max'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    this.calculation = (bucket, _key, _metric, bucketSizeInSeconds) => {
      const pipelineThroughputs = {};
      const pipelineBuckets = _.get(bucket, 'pipelines_nested.by_pipeline_id.buckets', []);
      pipelineBuckets.forEach(pipelineBucket => {
        pipelineThroughputs[pipelineBucket.key] =
          bucketSizeInSeconds ? _.get(pipelineBucket, 'throughput.value') / bucketSizeInSeconds : undefined;
      });

      return pipelineThroughputs;
    };
  }
}

export class BeatsMetric extends Metric {
  constructor(opts) {
    super({
      app: 'beats',
      uuidField: 'cluster_uuid',
      timestampField: 'beats_stats.timestamp',
      ...opts,
    });
  }

  // helper method
  static getMetricFields() {
    return {
      timestampField: 'beats_stats.timestamp',
      uuidField: 'cluster_uuid'
    };
  }
}

export class LogstashPipelineNodeCountMetric extends LogstashMetric {
  constructor(opts) {
    super({
      ...opts,
      derivative: false
    });

    this.dateHistogramSubAggs = {
      pipelines_nested: {
        nested: {
          path: 'logstash_stats.pipelines'
        },
        aggs: {
          by_pipeline_id: {
            terms: {
              field: 'logstash_stats.pipelines.id',
              size: 1000
            },
            aggs: {
              to_root: {
                reverse_nested: {},
                aggs: {
                  node_count: {
                    cardinality: {
                      field: this.field
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    this.calculation = (bucket) => {
      const pipelineNodesCounts = {};
      const pipelineBuckets = _.get(bucket, 'pipelines_nested.by_pipeline_id.buckets', []);
      pipelineBuckets.forEach(pipelineBucket => {
        pipelineNodesCounts[pipelineBucket.key] = _.get(pipelineBucket, 'to_root.node_count.value');
      });

      return pipelineNodesCounts;
    };
  }
}

export class BeatsEventsRateMetric extends BeatsMetric {
  constructor(opts) {
    super({
      format: LARGE_FLOAT,
      metricAgg: 'max',
      units: '/s',
      derivative: true,
      ...opts,
    });
  }
}

export class BeatsByteRateMetric extends BeatsMetric {
  constructor(opts) {
    super({
      format: LARGE_BYTES,
      metricAgg: 'max',
      units: '/s',
      derivative: true,
      ...opts,
    });
  }
}

export class BeatsEventsRateClusterMetric extends BeatsEventsRateMetric {
  constructor(opts) {
    super({
      uuidField: 'cluster_uuid',
      metricAgg: 'sum',
      ...opts,
    });
  }
}

export class BeatsByteRateClusterMetric extends BeatsByteRateMetric {
  constructor(opts) {
    super({
      uuidField: 'cluster_uuid',
      ...opts,
    });
  }
}
