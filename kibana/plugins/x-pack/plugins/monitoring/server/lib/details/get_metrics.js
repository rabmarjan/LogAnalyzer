import moment from 'moment';
import { isPlainObject } from 'lodash';
import Promise from 'bluebird';
import { checkParam } from '../error_missing_required';
import { calculateAuto } from '../calculate_auto';
import { getSeries } from './get_series';

export function getMetrics(req, indexPattern, filters = []) {
  checkParam(indexPattern, 'indexPattern in details/getMetrics');

  const config = req.server.config();
  // TODO: Pass in req parameters as explicit function parameters
  const min = moment.utc(req.payload.timeRange.min).valueOf();
  const max = moment.utc(req.payload.timeRange.max).valueOf();
  const duration = moment.duration(max - min, 'ms');
  const minIntervalSeconds = config.get('xpack.monitoring.min_interval_seconds');
  const bucketSize = Math.max(minIntervalSeconds, calculateAuto(100, duration).asSeconds());

  const metrics = req.payload.metrics || [];
  return Promise.map(metrics, metric => {
    // metric names match the literal metric name, but they can be supplied in groups or individually
    let metricNames;

    if (isPlainObject(metric)) {
      metricNames = metric.keys;
    } else {
      metricNames = [ metric ];
    }

    return Promise.map(metricNames, metricName => {
      return getSeries(req, indexPattern, metricName, filters, { min, max, bucketSize });
    });
  })
    .then(rows => {
      const data = {};
      metrics.forEach((key, index) => {
      // keyName must match the value stored in the html template
        const keyName = isPlainObject(key) ? key.name : key;
        data[keyName] = rows[index];
      });

      return data;
    });
}
