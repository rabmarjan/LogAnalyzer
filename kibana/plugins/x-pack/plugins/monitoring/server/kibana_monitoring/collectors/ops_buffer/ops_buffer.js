import { LOGGING_TAG, KIBANA_MONITORING_LOGGING_TAG } from '../../../../common/constants';
import { rollupEvent } from './rollup_event';
import { CloudDetector } from '../../../cloud';

/**
 * Manage the buffer of Kibana Ops events
 * @param {Object} server HapiJS server instance
 * @return {Object} the revealed `push` and `flush` modules
 */
export function opsBuffer(server) {
  const cloudDetector = new CloudDetector();
  // determine the cloud service in the background
  cloudDetector.detectCloudService();

  let lastOp = null;

  const getKibanaStatsData = () => {
    if (!lastOp) { return; }

    const rollup = lastOp.rollup;

    return {
      cloud: cloudDetector.getCloudDetails(),
      host: lastOp.host,
      ...rollup
    };
  };

  return {
    push(event) {
      lastOp = {
        host: event.host,
        rollup: rollupEvent(event, lastOp)
      };
      server.log(['debug', LOGGING_TAG, KIBANA_MONITORING_LOGGING_TAG], 'Received Kibana Ops event data');
    },
    flush() {
      return getKibanaStatsData();
    }
  };
}

