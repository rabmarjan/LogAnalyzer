/*
 * Logstash Node
 */
import { find } from 'lodash';
import uiRoutes from'ui/routes';
import { ajaxErrorHandlersProvider } from 'plugins/monitoring/lib/ajax_error_handler';
import { routeInitProvider } from 'plugins/monitoring/lib/route_init';
import template from './index.html';

function getPageData($injector) {
  const $http = $injector.get('$http');
  const $route = $injector.get('$route');
  const globalState = $injector.get('globalState');
  const url = `../api/monitoring/v1/clusters/${globalState.cluster_uuid}/logstash/node/${$route.current.params.uuid}`;
  const timefilter = $injector.get('timefilter');
  const timeBounds = timefilter.getBounds();
  const showCgroupMetricsLogstash = $injector.get('showCgroupMetricsLogstash');

  return $http.post(url, {
    ccs: globalState.ccs,
    timeRange: {
      min: timeBounds.min.toISOString(),
      max: timeBounds.max.toISOString()
    },
    metrics: [
      {
        name: 'logstash_os_load',
        keys: [
          'logstash_os_load_1m',
          'logstash_os_load_5m',
          'logstash_os_load_15m'
        ]
      },
      'logstash_events_input_rate',
      'logstash_events_output_rate',
      'logstash_events_latency',
      {
        name: 'logstash_node_cpu_metric',
        keys: showCgroupMetricsLogstash ?
          [ 'logstash_node_cgroup_quota_as_cpu_utilization' ] :
          [ 'logstash_node_cpu_utilization' ]
      },
      {
        name: 'logstash_jvm_usage',
        keys: [
          'logstash_node_jvm_mem_max_in_bytes',
          'logstash_node_jvm_mem_used_in_bytes'
        ]
      }
    ]
  })
    .then(response => response.data)
    .catch((err) => {
      const Private = $injector.get('Private');
      const ajaxErrorHandlers = Private(ajaxErrorHandlersProvider);
      return ajaxErrorHandlers(err);
    });
}

uiRoutes.when('/logstash/node/:uuid', {
  template,
  resolve: {
    clusters(Private) {
      const routeInit = Private(routeInitProvider);
      return routeInit();
    },
    pageData: getPageData
  },
  controller($injector, $scope) {
    const timefilter = $injector.get('timefilter');
    timefilter.enableTimeRangeSelector();
    timefilter.enableAutoRefreshSelector();

    const $route = $injector.get('$route');
    const globalState = $injector.get('globalState');
    $scope.cluster = find($route.current.locals.clusters, { cluster_uuid: globalState.cluster_uuid });
    $scope.pageData = $route.current.locals.pageData;

    const title = $injector.get('title');
    title($scope.cluster, `Logstash - ${$scope.pageData.nodeSummary.name}`);

    const $executor = $injector.get('$executor');
    $executor.register({
      execute: () => getPageData($injector),
      handleResponse: (response) => $scope.pageData = response
    });

    $executor.start();

    $scope.$on('$destroy', $executor.destroy);
  }
});
