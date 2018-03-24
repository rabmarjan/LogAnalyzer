import { ajaxErrorHandlersProvider } from 'plugins/monitoring/lib/ajax_error_handler';

export function getPageData($injector) {
  const $http = $injector.get('$http');
  const $route = $injector.get('$route');
  const globalState = $injector.get('globalState');
  const url = `../api/monitoring/v1/clusters/${globalState.cluster_uuid}/beats/beat/${$route.current.params.beatUuid}`;
  const timefilter = $injector.get('timefilter');
  const timeBounds = timefilter.getBounds();

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
          'beat_pipeline_events_total_rate',
          'beat_output_events_total',
          'beat_output_events_ack_rate',
          'beat_pipeline_events_emitted_rate',
        ]
      },
      {
        name: 'beat_fail_rates',
        keys: [
          'beat_pipeline_events_failed_rate',
          'beat_pipeline_events_dropped_rate',
          'beat_output_events_dropped_rate',
          'beat_pipeline_events_retry_rate',
        ]
      },
      {
        name: 'beat_throughput_rates',
        keys: [
          'beat_bytes_written',
          'beat_output_write_bytes_rate',
        ]
      },
      {
        name: 'beat_output_errors',
        keys: [
          'beat_output_sending_errors',
          'beat_output_receiving_errors',
        ]
      },
      {
        name: 'beat_memory',
        keys: [
          'beat_mem_alloc',
          'beat_mem_rss',
          'beat_mem_gc_next',
        ]
      },
      /*
       * TODO: CPU is not yet available in libbeat:
       * https://github.com/elastic/beats/issues/6063
       * {
       *   name: 'beat_cpu',
       *   keys: [
       *     'beat_cpu_process_utilization',
       *     'beat_cpu_system_utilization',
       *   ]
       * }, */
      {
        name: 'beat_os_load',
        keys: [
          'beat_system_os_load_1',
          'beat_system_os_load_5',
          'beat_system_os_load_15',
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
