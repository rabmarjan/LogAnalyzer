/*
 * Logstash Node Advanced View
 */
import { find } from 'lodash';
import uiRoutes from'ui/routes';
import { ajaxErrorHandlersProvider } from 'plugins/monitoring/lib/ajax_error_handler';
import { routeInitProvider } from 'plugins/monitoring/lib/route_init';
import template from './index.html';

function getPageData($injector) {
  const $http = $injector.get('$http');
  const globalState = $injector.get('globalState');
  const $route = $injector.get('$route');
  const url = `../api/monitoring/v1/clusters/${globalState.cluster_uuid}/logstash/node/${$route.current.params.uuid}`;
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
        name: 'logstash_node_cpu_utilization',
        keys: [
          'logstash_node_cpu_utilization',
          'logstash_node_cgroup_quota'
        ]
      },
      {
        name: 'logstash_node_cgroup_cpu',
        keys: [
          'logstash_node_cgroup_usage',
          'logstash_node_cgroup_throttled'
        ]
      },
      {
        name: 'logstash_node_cgroup_stats',
        keys: [
          'logstash_node_cgroup_periods',
          'logstash_node_cgroup_throttled_count'
        ]
      },
      'logstash_queue_events_count'
    ]
  })
    .then(response => response.data)
    .catch((err) => {
      const Private = $injector.get('Private');
      const ajaxErrorHandlers = Private(ajaxErrorHandlersProvider);
      return ajaxErrorHandlers(err);
    });
}

uiRoutes.when('/logstash/node/:uuid/advanced', {
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
    title($scope.cluster, `Logstash - ${$scope.pageData.nodeSummary.name} - Advanced`);

    const $executor = $injector.get('$executor');
    $executor.register({
      execute: () => getPageData($injector),
      handleResponse: (response) => $scope.pageData = response
    });

    $executor.start();

    $scope.$on('$destroy', $executor.destroy);
  }
});
