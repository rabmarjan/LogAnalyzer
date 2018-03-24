import _ from 'lodash';

export function pickMetricFields(metric) {
  const fields = [
    'app',
    'field',
    'label',
    'title',
    'description',
    'units',
    'format'
  ];
  return _.pick(metric, fields);
}
