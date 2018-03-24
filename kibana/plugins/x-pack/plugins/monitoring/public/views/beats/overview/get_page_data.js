import { ajaxErrorHandlersProvider } from 'plugins/monitoring/lib/ajax_error_handler';

export function getPageData($injector) {
  const $http = $injector.get('$http');
  const globalState = $injector.get('globalState');
  const timefilter = $injector.get('timefilter');
  const timeBounds = timefilter.getBounds();
  const url = `../api/monitoring/v1/clusters/${globalState.cluster_uuid}/beats`;

  return $http.post(url, {
    ccs: globalState.ccs,
    timeRange: {
      min: timeBounds.min.toISOString(),
      max: timeBounds.max.toISOString()
    },
    metrics: [
      {
        name: 'beat_event_rates',
        keys: [
          'beat_cluster_pipeline_events_total_rate',
          'beat_cluster_output_events_total',
          'beat_cluster_output_events_ack_rate',
          'beat_cluster_pipeline_events_emitted_rate',
        ]
      },
      {
        name: 'beat_fail_rates',
        keys: [
          'beat_cluster_pipeline_events_failed_rate',
          'beat_cluster_pipeline_events_dropped_rate',
          'beat_cluster_output_events_dropped_rate',
          'beat_cluster_pipeline_events_retry_rate',
        ]
      },
      {
        name: 'beat_throughput_rates',
        keys: [
          'beat_cluster_output_write_bytes_rate',
          'beat_cluster_output_read_bytes_rate',
        ]
      },
      {
        name: 'beat_output_errors',
        keys: [
          'beat_cluster_output_sending_errors',
          'beat_cluster_output_receiving_errors',
        ]
      },
    ]
  })
    .then(response => response.data)
    .catch((err) => {
      const Private = $injector.get('Private');
      const ajaxErrorHandlers = Private(ajaxErrorHandlersProvider);
      return ajaxErrorHandlers(err);
    });
}
