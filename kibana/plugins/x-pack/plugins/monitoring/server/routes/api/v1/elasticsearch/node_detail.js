import { get } from 'lodash';
import Joi from 'joi';
import { getClusterStats } from '../../../../lib/cluster/get_cluster_stats';
import { getNodeSummary } from '../../../../lib/elasticsearch/nodes';
import { getShardStats, getShardAllocation } from '../../../../lib/elasticsearch/shards';
import { getMetrics } from '../../../../lib/details/get_metrics';
import { handleError } from '../../../../lib/errors/handle_error';
import { prefixIndexPattern } from '../../../../lib/ccs_utils';

export function nodeRoutes(server) {

  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/nodes/{resolver}',
    config: {
      validate: {
        params: Joi.object({
          clusterUuid: Joi.string().required(),
          resolver: Joi.string().required()
        }),
        payload: Joi.object({
          ccs: Joi.string().optional(),
          showSystemIndices: Joi.boolean().default(false), // show/hide system indices in shard allocation table
          timeRange: Joi.object({
            min: Joi.date().required(),
            max: Joi.date().required()
          }).required(),
          metrics: Joi.array().required(),
          shards: Joi.boolean().default(true)
        })
      }
    },
    handler: async (req, reply) => {
      try {
        const config = server.config();
        const ccs = req.payload.ccs;
        const showSystemIndices = req.payload.showSystemIndices;
        const clusterUuid = req.params.clusterUuid;
        const resolver = req.params.resolver;
        const start = req.payload.timeRange.min;
        const end = req.payload.timeRange.max;
        const esIndexPattern = prefixIndexPattern(config, 'xpack.monitoring.elasticsearch.index_pattern', ccs);
        const collectShards = req.payload.shards;

        const cluster = await getClusterStats(req, esIndexPattern, clusterUuid);
        const nodeResolver = config.get('xpack.monitoring.node_resolver');

        const clusterState = get(cluster, 'cluster_state', { nodes: {} });
        const shardStats = await getShardStats(req, esIndexPattern, cluster, { includeIndices: true, includeNodes: true });
        const nodeSummary = await getNodeSummary(req, esIndexPattern, clusterState, shardStats, { clusterUuid, resolver, start, end });
        const metrics = await getMetrics(req, esIndexPattern, [{ term: { [`source_node.${nodeResolver}`]: resolver } }]);

        let shardAllocation;
        if (collectShards) {
          // TODO: Why so many fields needed for a single component (shard legend)?
          const shardFilter = { term: { [`source_node.${nodeResolver}`]: resolver } };
          const stateUuid = get(cluster, 'cluster_state.state_uuid');
          const allocationOptions = {
            nodeResolver,
            shardFilter,
            stateUuid,
            showSystemIndices,
          };
          const shards = await getShardAllocation(req, esIndexPattern, allocationOptions);

          shardAllocation = {
            shards,
            shardStats: { indices: shardStats.indices },
            nodes: shardStats.nodes, // for identifying nodes that shard relocates to
            stateUuid, // for debugging/troubleshooting
          };
        }

        reply({
          nodeSummary,
          metrics,
          ...shardAllocation
        });

      } catch (err) {
        reply(handleError(err, req));
      }
    }
  });

}
