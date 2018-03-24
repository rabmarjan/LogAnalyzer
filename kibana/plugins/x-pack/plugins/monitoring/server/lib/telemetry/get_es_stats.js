import { get } from 'lodash';

/**
 * Get statistics for all selected Elasticsearch clusters.
 *
 * @param {Object} server The server instance
 * @param {function} callCluster The callWithRequest or callWithInternalUser handler
 * @param {Array} clusterUuids The string Cluster UUIDs to fetch details for
 * @return {Promise} Array of the Elasticsearch clusters.
 */
export function getElasticsearchStats(server, callCluster, clusterUuids) {
  return fetchElasticsearchStats(server, callCluster, clusterUuids)
    .then(handleElasticsearchStats);
}

/**
 * Fetch the Elasticsearch stats.
 *
 * @param {Object} server The server instance
 * @param {function} callCluster The callWithRequest or callWithInternalUser handler
 * @param {Array} clusterUuids Cluster UUIDs to limit the request against
 * @return {Promise} Response for the aggregations to fetch detaild for the product.
 */
export function fetchElasticsearchStats(server, callCluster, clusterUuids) {
  const config = server.config();
  const params = {
    index: config.get('xpack.monitoring.elasticsearch.index_pattern'),
    filterPath: [
      'hits.hits._source.cluster_uuid',
      'hits.hits._source.timestamp',
      'hits.hits._source.cluster_name',
      'hits.hits._source.version',
      'hits.hits._source.license',
      'hits.hits._source.cluster_stats',
      'hits.hits._source.stack_stats'
    ],
    body: {
      size: config.get('xpack.monitoring.max_bucket_size'),
      query: {
        bool: {
          filter: [
            /*
             * Note: Unlike most places, we don't care about the old _type: cluster_stats because it would NOT
             * have the license in it (that used to be in the .monitoring-data-2 index in cluster_info)
             */
            { term: { type: 'cluster_stats' } },
            { terms: { cluster_uuid: clusterUuids } }
          ]
        }
      },
      collapse: { field: 'cluster_uuid' },
      sort: { timestamp: { order: 'desc' } }
    }
  };

  return callCluster('search', params);
}

/**
 * Extract the cluster stats for each cluster.
 *
 * @return {Array} The Elasticsearch clusters.
 */
export function handleElasticsearchStats(response) {
  const clusters = get(response, 'hits.hits', []);

  return clusters.map(cluster => cluster._source);
}
