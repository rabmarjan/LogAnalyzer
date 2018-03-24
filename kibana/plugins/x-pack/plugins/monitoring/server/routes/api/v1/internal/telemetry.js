import Joi from 'joi';
import { getAllStats } from '../../../../lib/telemetry';
import { handleError } from '../../../../lib/errors';

export function telemetryRoutes(server) {
  /**
   * Telemetry Data
   *
   * This provides a mechanism for fetching minor details about all clusters, including details related to the rest of the
   * stack (e.g., Kibana).
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/_stats',
    config: {
      validate: {
        payload: Joi.object({
          timeRange: Joi.object({
            min: Joi.date().required(),
            max: Joi.date().required()
          }).required()
        })
      }
    },
    handler: (req, reply) => {
      const start = req.payload.timeRange.min;
      const end = req.payload.timeRange.max;

      return getAllStats(req, start, end)
        .then(reply)
        .catch(err => {
          const config = req.server.config();

          if (config.get('env.dev')) {
          // don't ignore errors when running in dev mode
            reply(handleError(err, req));
          } else {
          // ignore errors, return empty set and a 200
            reply([]).code(200);
          }
        });
    }
  });
}
