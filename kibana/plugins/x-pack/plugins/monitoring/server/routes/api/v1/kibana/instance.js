import Joi from 'joi';
import { getKibanaInfo } from '../../../../lib/kibana/get_kibana_info';
import { handleError } from '../../../../lib/errors';
import { getMetrics } from '../../../../lib/details/get_metrics';
import { prefixIndexPattern } from '../../../../lib/ccs_utils';

/**
 * Kibana instance: This will fetch all data required to display a Kibana
 * instance's page. The current details returned are:
 * - Kibana Instance Summary (Status)
 * - Metrics
 */
export function kibanaInstanceRoutes(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/kibana/{kibanaUuid}',
    config: {
      validate: {
        params: Joi.object({
          clusterUuid: Joi.string().required(),
          kibanaUuid: Joi.string().required()
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
      const kibanaUuid = req.params.kibanaUuid;
      const kbnIndexPattern = prefixIndexPattern(config, 'xpack.monitoring.kibana.index_pattern', ccs);

      try {
        const [ metrics, kibanaSummary ] = await Promise.all([
          getMetrics(req, kbnIndexPattern),
          getKibanaInfo(req, kbnIndexPattern, { clusterUuid, kibanaUuid }),
        ]);

        reply({
          metrics,
          kibanaSummary,
        });
      } catch (err) {
        reply(handleError(err, req));
      }
    }
  });
}
