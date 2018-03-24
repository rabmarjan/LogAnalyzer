import { createQuery } from '../create_query';
import { ElasticsearchMetric } from '../metrics';

function scalarCounterAggregation(field, fieldPath, ephemeralIdField, maxBucketSize) {
  const fullPath = `${fieldPath}.${field}`;

  const byEphemeralIdName = `${field}_temp_by_ephemeral_id`;
  const sumName = `${field}_total`;

  const aggs = {};

  aggs[byEphemeralIdName] = {
    terms: {
      field: ephemeralIdField,
      size: maxBucketSize,
    },
    aggs: {
      max_value: {
        max: { field: fullPath }
      },
      min_value: {
        min: { field: fullPath }
      },
      difference: {
        bucket_script: {
          script: 'params.max - params.min',
          buckets_path: {
            min: 'min_value',
            max: 'max_value'
          }
        }
      }
    }
  };

  aggs[sumName] = {
    sum_bucket: {
      buckets_path: `${byEphemeralIdName}>difference`
    }
  };

  return aggs;
}

function nestedVertices(maxBucketSize) {
  const fieldPath = 'logstash_stats.pipelines.vertices';
  const ephemeralIdField = 'logstash_stats.pipelines.vertices.pipeline_ephemeral_id';

  return {
    nested: { path: 'logstash_stats.pipelines.vertices' },
    aggs: {
      vertex_id: {
        terms: {
          field: 'logstash_stats.pipelines.vertices.id',
          size: maxBucketSize
        },
        aggs: {
          ...scalarCounterAggregation('events_in', fieldPath, ephemeralIdField, maxBucketSize),
          ...scalarCounterAggregation('events_out', fieldPath, ephemeralIdField, maxBucketSize),
          ...scalarCounterAggregation('duration_in_millis', fieldPath, ephemeralIdField, maxBucketSize),
          ...scalarCounterAggregation('queue_push_duration_in_millis', fieldPath, ephemeralIdField, maxBucketSize)
        }
      }
    }
  };
}

function outerAggs(pipelineId, pipelineHash, maxBucketSize) {
  const filteredAggs = {
    events_duration: {
      stats: {
        field: 'logstash_stats.pipelines.events.duration_in_millis'
      }
    },
    timebounds: {
      reverse_nested: {},
      aggs: {
        first_seen: {
          min: {
            field: 'logstash_stats.timestamp'
          }
        },
        last_seen: {
          max: {
            field: 'logstash_stats.timestamp'
          }
        }
      }
    },
    vertices: nestedVertices(maxBucketSize)
  };

  return {
    pipelines: {
      nested: { path: 'logstash_stats.pipelines' },
      aggs: {
        scoped: {
          filter: {
            bool: {
              filter: [
                { term: { 'logstash_stats.pipelines.id': pipelineId } },
                { term: { 'logstash_stats.pipelines.hash': pipelineHash } }
              ]
            }
          },
          aggs: filteredAggs
        }
      }
    }
  };
}

export async function getPipelineStatsAggregation(callWithRequest, req, logstashIndexPattern,
  { clusterUuid, start, end, pipelineId, pipelineHash }) {
  const filters = [
    {
      nested: {
        path: 'logstash_stats.pipelines',
        query: {
          bool: {
            must: [
              { term: { 'logstash_stats.pipelines.hash': pipelineHash } },
              { term: { 'logstash_stats.pipelines.id': pipelineId } },
            ]
          }
        }
      }
    }
  ];

  const query = createQuery({
    type: 'logstash_stats',
    start,
    end,
    metric: ElasticsearchMetric.getMetricFields(),
    clusterUuid,
    filters
  });

  const config = req.server.config();

  const params = {
    index: logstashIndexPattern,
    size: 0,
    body: {
      query: query,
      aggs: outerAggs(pipelineId, pipelineHash, config.get('xpack.monitoring.max_bucket_size'))
    }
  };

  const resp = await callWithRequest(req, 'search', params);

  // Return null if doc not found
  return resp;
}
