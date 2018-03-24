import { metrics } from '../metrics';

export function getAggItems(options) {
  const { listingMetrics, bucketSize } = options;
  const aggItems = {};

  listingMetrics.forEach((metricName) => {

    const metric = metrics[metricName];
    let metricAgg = null;

    if (!metric) { return; }
    if (!metric.aggs) {
      metricAgg = {
        metric: {},
        // https://github.com/elastic/x-pack/issues/4378
        metric_deriv: {
          derivative: {
            buckets_path: 'metric',
            unit: 'second'
          }
        }
      };
      metricAgg.metric[metric.metricAgg] = {
        field: metric.field
      };
    }

    aggItems[metricName] = {
      date_histogram: {
        field: 'timestamp',
        min_doc_count: 0,
        interval: bucketSize + 's'
      },
      aggs: metric.aggs || metricAgg
    };

  });

  return aggItems;
}
