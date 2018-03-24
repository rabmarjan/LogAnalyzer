import Joi from 'joi';
import { prefixIndexPattern } from '../../../../lib/ccs_utils';
import { getStats, getBeats } from '../../../../lib/beats';
import { handleError } from '../../../../lib/errors';

export function beatsOverviewRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/beats/beats',
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
        })
      }
    },
    async handler(req, reply) {

      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const beatsIndexPattern = prefixIndexPattern(config, 'xpack.monitoring.beats.index_pattern', ccs);

      try {

        const [ stats, listing ] = await Promise.all([
          getStats(req, beatsIndexPattern, clusterUuid),
          getBeats(req, beatsIndexPattern, clusterUuid),
        ]);

        reply({
          stats,
          listing
        });

      } catch (err) {
        reply(handleError(err, req));
      }

    }
  });
}
