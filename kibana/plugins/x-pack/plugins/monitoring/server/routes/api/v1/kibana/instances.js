import Joi from 'joi';
import { get } from 'lodash';
import { getKibanas } from '../../../../lib/kibana/get_kibanas';
import { getKibanasForClusters } from '../../../../lib/kibana/get_kibanas_for_clusters';
import { handleError } from '../../../../lib/errors';
import { getMetrics } from '../../../../lib/details/get_metrics';
import { prefixIndexPattern } from '../../../../lib/ccs_utils';

const getKibanaClusterStatus = function (req, kbnIndexPattern, { clusterUuid }) {
  const clusters = [{ cluster_uuid: clusterUuid }];
  return getKibanasForClusters(req, kbnIndexPattern, clusters)
    .then(kibanas => get(kibanas, '[0].stats'));
};

/*
 * Kibana routes
 */
export function kibanaInstancesRoutes(server) {
  /**
   * Kibana overview (metrics) and listing (instances)
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/kibana',
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
          metrics: Joi.array().optional(),
          instances: Joi.boolean().default(true)
        })
      }
    },
    async handler(req, reply) {
      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const kbnIndexPattern = prefixIndexPattern(config, 'xpack.monitoring.kibana.index_pattern', ccs);

      try {
        const clusterStatusPromise = getKibanaClusterStatus(req, kbnIndexPattern, { clusterUuid });
        let metricsPromise;
        let instancesPromise;

        if (req.payload.metrics) {
          metricsPromise = getMetrics(req, kbnIndexPattern);
        } else if (req.payload.instances) {
          metricsPromise = {};
          instancesPromise = getKibanas(req, kbnIndexPattern, { clusterUuid });
        }

        const [ clusterStatus, metrics, kibanas ] = await Promise.all([
          clusterStatusPromise,
          metricsPromise,
          instancesPromise,
        ]);

        reply({
          clusterStatus,
          metrics,
          kibanas,
        });
      } catch(err) {
        reply(handleError(err, req));
      }
    }
  });
}
