import { get } from 'lodash';
import { checkParam } from '../error_missing_required';
import { createQuery } from '../create_query';
import { ElasticsearchMetric } from '../metrics';

export function getClusterLicense(req, esIndexPattern, clusterUuid) {
  checkParam(esIndexPattern, 'esIndexPattern in getClusterLicense');

  const params = {
    index: esIndexPattern,
    filterPath: 'hits.hits._source.license',
    body: {
      size: 1,
      sort: { timestamp: { order: 'desc' } },
      query: createQuery({
        type: 'cluster_stats',
        clusterUuid,
        metric: ElasticsearchMetric.getMetricFields()
      })
    }
  };

  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params)
    .then(response => {
      return get(response, 'hits.hits[0]._source.license', {});
    });
}
