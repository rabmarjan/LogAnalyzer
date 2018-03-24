import { LOGGING_TAG, KIBANA_MONITORING_LOGGING_TAG, } from '../../common/constants';
import { monitoringBulk } from './lib/monitoring_bulk';
import { startCollector } from './start_collector';

/**
 * @param kbnServer {Object} manager of Kibana services - see `src/server/kbn_server` in Kibana core
 * @param server {Object} HapiJS server instance
 */
export async function initKibanaMonitoring(kbnServer, server) {
  const mainXpackInfo = server.plugins.xpack_main.info;
  const mainMonitoring = mainXpackInfo.feature('monitoring');

  if (mainXpackInfo && mainMonitoring.isAvailable() && mainMonitoring.isEnabled()) {
    const client = server.plugins.elasticsearch.getCluster('admin').createClient({
      plugins: [monitoringBulk]
    });

    startCollector(kbnServer, server, client);
  } else {
    server.log(
      ['error', LOGGING_TAG, KIBANA_MONITORING_LOGGING_TAG],
      'Unable to retrieve X-Pack info from the admin cluster. Kibana monitoring will be disabled until Kibana is restarted.'
    );
  }
}
