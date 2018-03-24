import { get, isUndefined } from 'lodash';
import Joi from 'joi';
import { getClusterStats } from '../../../../lib/cluster/get_cluster_stats';
import { getClusterStatus } from '../../../../lib/cluster/get_cluster_status';
import {
  getNodes,
  calculateNodeType,
  getNodeTypeClassLabel,
  getDefaultNodeFromId
} from '../../../../lib/elasticsearch/nodes';
import { getShardStats } from '../../../../lib/elasticsearch/shards';
import { handleError } from '../../../../lib/errors/handle_error';
import { prefixIndexPattern } from '../../../../lib/ccs_utils';

export function nodesRoutes(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/nodes',
    config: {
      validate: {
        params: Joi.object({
          clusterUuid: Joi.string().required()
        }),
        payload: Joi.object({
          ccs: Joi.string().optional(),
          timeRange: Joi.object({
            min: Joi.date().required(),
            max: Joi.date().required()
          }).required(),
          listingMetrics: Joi.array().required()
        })
      }
    },
    async handler(req, reply) {
      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const esIndexPattern = prefixIndexPattern(config, 'xpack.monitoring.elasticsearch.index_pattern', ccs);

      try {
        const clusterStats = await getClusterStats(req, esIndexPattern, clusterUuid);
        const shardStats = await getShardStats(req, esIndexPattern, clusterStats, { includeNodes: true });
        const { nodes, rows } = await getNodes(req, esIndexPattern);

        const clusterState = get(clusterStats, 'cluster_state', { nodes: {} });

        const mappedRows = rows.map(({ name, metrics }) => {
          const node = nodes[name] || getDefaultNodeFromId(name);
          const calculatedNodeType = calculateNodeType(node, get(clusterState, 'master_node'));
          const { nodeType, nodeTypeLabel, nodeTypeClass } = getNodeTypeClassLabel(node, calculatedNodeType);
          const isOnline = !isUndefined(clusterState.nodes[name]);

          const getMetrics = () => {
            return {
              ...metrics,
              shard_count: get(shardStats, `nodes[${name}].shardCount`, 0)
            };
          };
          const _metrics = isOnline ? getMetrics() : undefined;

          return {
            resolver: name,
            online: isOnline,
            metrics: _metrics,
            node: {
              ...node,
              type: nodeType,
              nodeTypeLabel: nodeTypeLabel,
              nodeTypeClass: nodeTypeClass
            }
          };
        });

        reply({
          clusterStatus: getClusterStatus(clusterStats, shardStats),
          rows: mappedRows,
          nodes,
        });
      } catch(err) {
        reply(handleError(err, req));
      }
    }
  });

}
