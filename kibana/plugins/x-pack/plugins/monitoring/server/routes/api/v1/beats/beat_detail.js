import Joi from 'joi';
import { prefixIndexPattern } from '../../../../lib/ccs_utils';
import { getBeatSummary } from '../../../../lib/beats';
import { getMetrics } from '../../../../lib/details/get_metrics';
import { handleError } from '../../../../lib/errors';

export function beatsDetailRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/beats/beat/{beatUuid}',
    config: {
      validate: {
        params: Joi.object({
          clusterUuid: Joi.string().required(),
          beatUuid: Joi.string().required(),
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

      const clusterUuid = req.params.clusterUuid;
      const beatUuid = req.params.beatUuid;
      const config = server.config();
      const ccs = req.payload.ccs;
      const beatsIndexPattern = prefixIndexPattern(config, 'xpack.monitoring.beats.index_pattern', ccs);
      const summaryOptions = {
        clusterUuid,
        beatUuid,
        start: req.payload.timeRange.min,
        end: req.payload.timeRange.max,
      };

      try {
        const [ summary, metrics ] = await Promise.all([
          getBeatSummary(req, beatsIndexPattern, summaryOptions),
          getMetrics(req, beatsIndexPattern, [{ term: { 'beats_stats.beat.uuid': beatUuid } }]),
        ]);

        reply({
          summary,
          metrics,
        });
      } catch (err) {
        reply(handleError(err, req));
      }

    }
  });
}
