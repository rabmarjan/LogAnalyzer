import Joi from 'joi';
import { getClusterStatus } from '../../../../lib/logstash/get_cluster_status';
import { getMetrics } from '../../../../lib/details/get_metrics';
import { handleError } from '../../../../lib/errors';
import { prefixIndexPattern } from '../../../../lib/ccs_utils';

/*
 * Logstash Overview route.
 */
export function logstashOverviewRoute(server) {
  /**
   * Logstash Overview request.
   *
   * This will fetch all data required to display the Logstash Overview page.
   *
   * The current details returned are:
   *
   * - Logstash Cluster Status
   * - Metrics
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash',
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
          metrics: Joi.array().required()
        })
      }
    },
    async handler(req, reply) {
      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const lsIndexPattern = prefixIndexPattern(config, 'xpack.monitoring.logstash.index_pattern', ccs);

      try {
        const [ metrics, clusterStatus ] = await Promise.all([
          getMetrics(req, lsIndexPattern),
          getClusterStatus(req, lsIndexPattern, { clusterUuid })
        ]);

        reply({
          metrics,
          clusterStatus,
        });
      } catch(err) {
        reply(handleError(err, req));
      }
    }
  });
}
