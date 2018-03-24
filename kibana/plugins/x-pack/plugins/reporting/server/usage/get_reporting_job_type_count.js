import { get } from 'lodash';

/*
 * @param {Object} response: Elasticsearch response for an aggregation
 * @return {Object} has a field for the total number of hits, and a nested
 * field for each job type found in the reporting data along with the count of
  * reports for that type
 */
function handleResponse(response) {
  const typeBuckets = get(response, 'aggregations.types.buckets', []);
  return {
    total: get(response, 'hits.total'),
    counts: typeBuckets.reduce((accum, current) => {
      return {
        ...accum,
        [current.key]: current.doc_count,
      };
    }, {})
  };
}

/*
 * Queries Elasticsearch with a terms aggregation on the Reporting data to get
 * a count of how many reports have been made for each kind of job type
 * @param {Function} callCluster: callWithRequest wrapper
 * @param {Object} config: Kibana server config
 * @param {Number} numExportTypes: used for the size in the terms aggregation
 * @param {Object} see handleResponse
 */
export function getReportingJobTypeCount(callCluster, config, numExportTypes) {
  let reportingIndex;
  try {
    // if the reporting plugin is disabled, any `xpack.reporting.*` config is an unknown config key
    reportingIndex = config.get('xpack.reporting.index');
  } catch(err) {
    // abort from querying if we're unable to determine the correct index to use.
    return {
      total: null,
      counts: {}
    };
  }

  const params = {
    index: `${reportingIndex}-*`,
    filterPath: [
      'hits.total',
      'aggregations.types.buckets',
    ],
    body: {
      size: 0,
      aggs: {
        types: {
          terms: {
            field: 'jobtype',
            size: numExportTypes,
          }
        }
      }
    }
  };

  return callCluster('search', params)
    .then(response => handleResponse(response));
}
