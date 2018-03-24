import { get, partialRight } from 'lodash';
import moment from 'moment';
import { checkParam } from '../error_missing_required';
import { metrics } from '../metrics';
import { createQuery } from '../create_query.js';
import { pickMetricFields } from '../pick_metric_fields';
import { formatTimestampToDuration } from '../../../common';
import { CALCULATE_DURATION_UNTIL } from '../../../common/constants';

/**
 * Derivative metrics for the first two agg buckets are unusable. For the first bucket, there
 * simply is no derivative metric (as calculating a derivative requires two adjacent buckets). For
 * the second bucket the derivative value can be artificially high if the first bucket was a partial
 * bucket (can happen with date_histogram buckets). Such a high value shows up as a spike in charts.
 * For such cases, to have accurate derivative values, it becomes necessary to discard the first two
 * buckets. Rather than discarding the _actual_ first two buckets, this function offsets the `min`
 * timestamp value (i.e. the lower bound of the timepicker range) into the past by two buckets. That
 * way, we can later discard these two buckets without affecting the actual buckets.
 *
 * @param {int} minInMsSinceEpoch Lower bound of timepicker range, in ms-since-epoch
 * @param {int} bucketSizeInSeconds Size of a single date_histogram bucket, in seconds
 */
function offsetMinForDerivativeMetric(minInMsSinceEpoch, bucketSizeInSeconds) {
  return minInMsSinceEpoch - (2 * bucketSizeInSeconds * 1000);
}

// Use the metric object as the source of truth on where to find the UUID
function getUuid(req, metric) {
  if (metric.app === 'kibana') {
    return req.params.kibanaUuid;
  } else if (metric.app === 'logstash') {
    return req.params.logstashUuid;
  } else if (metric.app === 'elasticsearch') {
    return req.params.resolver;
  }
}

function defaultCalculation(bucket, key, metric, bucketSizeInSeconds) {
  // [${key}] guarantees that if the key has periods in it, it gets interpreted as a single key value
  const value =  get(bucket, `[${key}].value`, null);

  // negatives suggest derivatives that have been reset (usually due to restarts that reset the count)
  if (value < 0) {
    return null;
  } else if (value && metric.units === '/s') {
    // convert metric_deriv from the bucket size to seconds if units == '/s'
    return value / bucketSizeInSeconds;
  }

  return value;
}

function createMetricAggs(metric) {
  if (metric.derivative) {
    return {
      metric_deriv: {
        derivative: { buckets_path: 'metric', gap_policy: 'skip' }
      },
      ...metric.aggs
    };
  }

  return metric.aggs;
}

function fetchSeries(req, indexPattern, metric, min, max, bucketSize, filters) {
  // if we're using a derivative metric, offset the min (also @see comment on offsetMinForDerivativeMetric function)
  const adjustedMin = metric.derivative ? offsetMinForDerivativeMetric(min, bucketSize) : min;

  const dateHistogramSubAggs = metric.dateHistogramSubAggs || {
    metric: {
      [metric.metricAgg]: {
        field: metric.field
      }
    },
    ...createMetricAggs(metric)
  };

  const params = {
    index: indexPattern,
    size: 0,
    ignoreUnavailable: true,
    body: {
      query: createQuery({
        start: adjustedMin,
        end: max,
        metric,
        clusterUuid: req.params.clusterUuid,
        // TODO: Pass in the UUID as an explicit function parameter
        uuid: getUuid(req, metric),
        filters
      }),
      aggs: {
        check: {
          date_histogram: {
            field: metric.timestampField,
            interval: bucketSize + 's'
          },
          aggs: {
            ...dateHistogramSubAggs
          }
        }
      }
    }
  };

  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params);
}

/**
 * Find the first usable index in the {@code buckets} that should be used based on the {@code min} timeframe.
 *
 * @param {Array} buckets The buckets keyed by the timestamp.
 * @param {String} min Max timestamp for results to exist within.
 * @return {Number} Index position to use for the first bucket. {@code buckets.length} if none should be used.
 */
function findFirstUsableBucketIndex(buckets, min) {
  const minInMillis = moment.utc(min).valueOf();

  for (let i = 0; i < buckets.length; ++i) {
    const bucketTime = get(buckets, [i, 'key']);
    const bucketTimeInMillis = moment.utc(bucketTime).valueOf();

    // if the bucket start time, without knowing the bucket size, is before the filter time, then it's inherently a partial bucket
    if (bucketTimeInMillis >= minInMillis) {
      return i;
    }
  }

  return buckets.length;
}

/**
 * Find the last usable index in the {@code buckets} that should be used based on the {@code max} timeframe.
 *
 * Setting the bucket size to anything above 0 means that partial buckets will be EXCLUDED because the bucket's
 * start time is considered with the bucket's size.
 *
 * @param {Array} buckets The buckets keyed by the timestamp.
 * @param {String} max Max timestamp for results to exist within.
 * @param {Number} firstUsableBucketIndex The index of the first used bucket (so we can stop looking after it is found).
 * @param {Number} bucketSizeInMillis Size of a bucket in milliseconds. Set to 0 to allow partial trailing buckets.
 * @return {Number} Index position to use for the last bucket. {@code -1} if none should be used.
 */
function findLastUsableBucketIndex(buckets, max, firstUsableBucketIndex, bucketSizeInMillis = 0) {
  const maxInMillis = moment.utc(max).valueOf();

  for (let i = buckets.length - 1; i > firstUsableBucketIndex - 1; --i) {
    const bucketTime = get(buckets, [i, 'key']);
    const bucketTimeInMillis = moment.utc(bucketTime).valueOf() + bucketSizeInMillis;

    if (bucketTimeInMillis <= maxInMillis) {
      return i;
    }
  }

  // note: the -1 forces any comparisons with this value and the first index to fail
  return -1;
}

const formatBucketSize = bucketSizeInSeconds => {
  const now = moment();
  const timestamp = moment(now).add(bucketSizeInSeconds, 'seconds'); // clone the `now` object

  return formatTimestampToDuration(timestamp, CALCULATE_DURATION_UNTIL, now);
};

function handleSeries(metric, min, max, bucketSizeInSeconds, response) {
  const buckets = get(response, 'aggregations.check.buckets', []);
  const firstUsableBucketIndex = findFirstUsableBucketIndex(buckets, min);
  const lastUsableBucketIndex = findLastUsableBucketIndex(buckets, max, firstUsableBucketIndex, bucketSizeInSeconds * 1000);
  let data = [];

  if (firstUsableBucketIndex <= lastUsableBucketIndex) {
    // map buckets to values for charts
    const key = metric.derivative ? 'metric_deriv' : 'metric';
    const bucketMapper = partialRight(metric.calculation || defaultCalculation, key, metric, bucketSizeInSeconds);

    data = buckets
      .slice(firstUsableBucketIndex, lastUsableBucketIndex + 1) // take only the buckets we know are usable
      .map(bucket => [ bucket.key, bucketMapper(bucket) ]); // map buckets to X/Y coords for Flot charting
  }

  return {
    bucket_size: formatBucketSize(bucketSizeInSeconds),
    timeRange: { min, max },
    metric: pickMetricFields(metric),
    data
  };
}

/**
 * Calculate the series (aka, time-plotted) values for a single metric.
 *
 * TODO: This should be expanded to accept multiple metrics in a single request to allow a single date histogram to be used.
 *
 * @param {Object} req The incoming user's request.
 * @param {String} indexPattern The relevant index pattern (not just for Elasticsearch!).
 * @param {String} metricName The name of the metric being plotted.
 * @param {Array} filters Any filters that should be applied to the query.
 * @return {Promise} The object response containing the {@code timeRange}, {@code metric}, and {@code data}.
 */
export function getSeries(req, indexPattern, metricName, filters, { min, max, bucketSize }) {
  checkParam(indexPattern, 'indexPattern in details/getSeries');

  const metric = metrics[metricName];
  return fetchSeries(req, indexPattern, metric, min, max, bucketSize, filters)
    .then(response => handleSeries(metric, min, max, bucketSize, response));
}
