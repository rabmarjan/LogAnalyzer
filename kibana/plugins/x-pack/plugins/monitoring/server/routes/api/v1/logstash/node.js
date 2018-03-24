import Joi from 'joi';
import { getNodeInfo } from '../../../../lib/logstash/get_node_info';
import { handleError } from '../../../../lib/errors';
import { getMetrics } from '../../../../lib/details/get_metrics';
import { prefixIndexPattern } from '../../../../lib/ccs_utils';

/*
 * Logstash Node route.
 */
export function logstashNodeRoute(server) {
  /**
   * Logtash Node request.
   *
   * This will fetch all data required to display a Logstash Node page.
   *
   * The current details returned are:
   *
   * - Logstash Node Summary (Status)
   * - Metrics
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/node/{logstashUuid}',
    config: {
      validate: {
        params: Joi.object({
          clusterUuid: Joi.string().required(),
          logstashUuid: Joi.string().required()
        }),
        payload: Joi.object({
          ccs: Joi.string().optional(),
          timeRange: Joi.object({
            min: Joi.date().required(),
            max: Joi.date().required()
          }).required(),
          metrics: Joi.array().required()
        })
      }
    },
    async handler(req, reply) {
      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const lsIndexPattern = prefixIndexPattern(config, 'xpack.monitoring.logstash.index_pattern', ccs);
      const logstashUuid = req.params.logstashUuid;

      try {
        const [ metrics, nodeSummary ] = await Promise.all([
          getMetrics(req, lsIndexPattern),
          getNodeInfo(req, lsIndexPattern, { clusterUuid, logstashUuid }),
        ]);

        reply({
          metrics,
          nodeSummary,
        });
      } catch(err) {
        reply(handleError(err, req));
      }
    }
  });
}
