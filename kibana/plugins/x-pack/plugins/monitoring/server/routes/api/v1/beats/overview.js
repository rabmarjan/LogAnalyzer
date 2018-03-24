import Joi from 'joi';
import { prefixIndexPattern } from '../../../../lib/ccs_utils';
import { getMetrics } from '../../../../lib/details/get_metrics';
import { getLatestStats, getStats } from '../../../../lib/beats';
import { handleError } from '../../../../lib/errors';

export function beatsOverviewRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/beats',
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
          metrics: Joi.array().required(),
        })
      }
    },
    async handler(req, reply) {

      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const beatsIndexPattern = prefixIndexPattern(config, 'xpack.monitoring.beats.index_pattern', ccs);

      try {
        const [
          latest,
          stats,
          metrics,
        ] = await Promise.all([
          getLatestStats(req, beatsIndexPattern, clusterUuid),
          getStats(req, beatsIndexPattern, clusterUuid),
          getMetrics(req, beatsIndexPattern),
        ]);

        reply({
          ...latest,
          stats,
          metrics
        });
      } catch (err) {
        reply(handleError(err, req));
      }

    }
  });
}
