import { get } from 'lodash';
import { createQuery } from '../create_query';
import { ElasticsearchMetric } from '../metrics'; // TODO should be KibanaMetric to use kibana_stats.timestamp in the query
import { KIBANA_SYSTEM_ID, REPORTING_SYSTEM_ID } from '../../../common/constants';

const reportingStatsPath = `${KIBANA_SYSTEM_ID}_stats.usage.xpack.${REPORTING_SYSTEM_ID}`;

export function fetchHighLevelReportingStats(server, callCluster, clusterUuids, start, end) {
  const config = server.config();
  const size = config.get('xpack.monitoring.max_bucket_size');
  const params = {
    index: config.get(`xpack.monitoring.${KIBANA_SYSTEM_ID}.index_pattern`),
    body: {
      size,
      query: createQuery({
        start,
        end,
        type: `${KIBANA_SYSTEM_ID}_stats`, // reporting stats are in kibana_stats.xpack.reporting
        metric: ElasticsearchMetric.getMetricFields(),
        filters: [ { terms: { cluster_uuid: clusterUuids } } ]
      }),
      collapse: {
        field: 'cluster_uuid'
      },
      sort: [
        { 'timestamp': 'desc' }
      ],
      _source: {
        includes: [
          'cluster_uuid',
          reportingStatsPath,
        ]
      },
    }
  };

  return callCluster('search', params);
}

export function handleHighLevelReportingStatsResponse(response) {
  const hits = get(response, 'hits.hits', []);
  return hits.reduce((accum, curr) => {
    const clusterUuid = get(curr, '_source.cluster_uuid');
    const stats = get(curr, `_source.${reportingStatsPath}`);
    return {
      ...accum,
      [clusterUuid]: stats
    };
  }, {});
}

export async function getReportingStats(server, callCluster, clusterUuids, start, end) {
  const rawStats = await fetchHighLevelReportingStats(server, callCluster, clusterUuids, start, end, REPORTING_SYSTEM_ID);
  const stats = handleHighLevelReportingStatsResponse(rawStats);

  return stats;
}
