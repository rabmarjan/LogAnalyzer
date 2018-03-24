import { chain } from 'lodash';

/*
 * Chart titles are taken from `metric.title` or `metric.label` fields in the series data.
 * Use title if found, otherwise use label
 */
export function getTitle(series) {
  return chain(series.map((s) => {
    return s.metric.title || s.metric.label;
  }))
    .first()
    .value();
}
