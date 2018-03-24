import Joi from 'joi';
import { getClusterStatus } from '../../../../../lib/logstash/get_cluster_status';
import { getPipelines } from '../../../../../lib/logstash/get_pipelines';
import { handleError } from '../../../../../lib/errors';
import { prefixIndexPattern } from '../../../../../lib/ccs_utils';

/**
 * Retrieve pipelines for a cluster
 */
export function logstashClusterPipelinesRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/pipelines',
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
          metrics: Joi.array().items(Joi.string()).required()
        })
      }
    },
    handler: async (req, reply) => {
      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const lsIndexPattern = prefixIndexPattern(config, 'xpack.monitoring.logstash.index_pattern', ccs);

      try {
        const response = {
          pipelines: await getPipelines(req, lsIndexPattern),
          clusterStatus: await getClusterStatus(req, lsIndexPattern, { clusterUuid })
        };
        reply(response);
      } catch (err) {
        reply(handleError(err, req));
      }
    }
  });
}
