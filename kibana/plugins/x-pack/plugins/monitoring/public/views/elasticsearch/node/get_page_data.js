import { ajaxErrorHandlersProvider } from 'plugins/monitoring/lib/ajax_error_handler';

export function getPageData($injector) {
  const $http = $injector.get('$http');
  const globalState = $injector.get('globalState');
  const $route = $injector.get('$route');
  const url = `../api/monitoring/v1/clusters/${globalState.cluster_uuid}/elasticsearch/nodes/${$route.current.params.node}`;
  const features = $injector.get('features');
  const showSystemIndices = features.isEnabled('showSystemIndices', false);
  const timefilter = $injector.get('timefilter');
  const timeBounds = timefilter.getBounds();
  const showCgroupMetricsElasticsearch = $injector.get('showCgroupMetricsElasticsearch');

  return $http.post(url, {
    showSystemIndices,
    ccs: globalState.ccs,
    timeRange: {
      min: timeBounds.min.toISOString(),
      max: timeBounds.max.toISOString()
    },
    metrics: [
      {
        name: 'node_latency',
        keys: [
          'node_query_latency',
          'node_index_latency'
        ]
      },
      {
        name: 'node_jvm_mem',
        keys: [ 'node_jvm_mem_max_in_bytes', 'node_jvm_mem_used_in_bytes' ]
      },
      {
        name: 'node_mem',
        keys: [
          'node_index_mem_overall',
          'node_index_mem_terms',
          'node_index_mem_points'
        ]
      },
      {
        name: 'node_cpu_metric',
        keys: showCgroupMetricsElasticsearch ?
          [ 'node_cgroup_quota_as_cpu_utilization' ] :
          [ 'node_cpu_utilization' ]
      },
      'node_load_average',
      'node_segment_count'
    ]
  })
    .then(response => response.data)
    .catch((err) => {
      const Private = $injector.get('Private');
      const ajaxErrorHandlers = Private(ajaxErrorHandlersProvider);
      return ajaxErrorHandlers(err);
    });
}
