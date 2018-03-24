import { MONITORING_SYSTEM_API_VERSION, KIBANA_SYSTEM_ID } from '../../../common/constants';

/*
 * Send the Kibana usage data to the ES Monitoring Bulk endpoint
 */
export function sendBulkPayload(client, interval, payload) {
  return client.monitoring.bulk({
    system_id: KIBANA_SYSTEM_ID,
    system_api_version: MONITORING_SYSTEM_API_VERSION,
    interval: interval + 'ms',
    body: payload
  });
}
