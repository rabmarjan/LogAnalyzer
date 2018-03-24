/**
 * Controller for Advanced Index Detail
 */
import { find } from 'lodash';
import uiRoutes from 'ui/routes';
import { ajaxErrorHandlersProvider } from 'plugins/monitoring/lib/ajax_error_handler';
import { routeInitProvider } from 'plugins/monitoring/lib/route_init';
import template from './index.html';

function getPageData($injector) {
  const globalState = $injector.get('globalState');
  const $route = $injector.get('$route');
  const url = `../api/monitoring/v1/clusters/${globalState.cluster_uuid}/elasticsearch/indices/${$route.current.params.index}`;
  const $http = $injector.get('$http');
  const timefilter = $injector.get('timefilter');
  const timeBounds = timefilter.getBounds();

  return $http.post(url, {
    ccs: globalState.ccs,
    timeRange: {
      min: timeBounds.min.toISOString(),
      max: timeBounds.max.toISOString()
    },
    shards: false,
    metrics: [
      {
        name: 'index_1',
        keys: [
          'index_mem_overall_1',
          'index_mem_stored_fields',
          'index_mem_doc_values',
          'index_mem_norms'
        ]
      },
      {
        name: 'index_2',
        keys: [
          'index_mem_overall_2',
          'index_mem_terms',
          'index_mem_points'
        ]
      },
      {
        name: 'index_3',
        keys: [
          'index_mem_overall_3',
          'index_mem_fixed_bit_set',
          'index_mem_term_vectors',
          'index_mem_versions'
        ]
      },
      {
        name: 'index_4',
        keys: [
          'index_mem_query_cache',
          'index_mem_request_cache',
          'index_mem_fielddata',
          'index_mem_writer'
        ]
      },
      {
        name: 'index_total',
        keys: [
          'index_searching_total',
          'index_indexing_total'
        ]
      },
      {
        name: 'index_time',
        keys: [
          'index_searching_time',
          'index_indexing_total_time',
          'index_indexing_primaries_time'
        ]
      },
      {
        name: 'index_throttling',
        keys: [
          'index_throttling_indexing_total_time',
          'index_throttling_indexing_primaries_time'
        ]
      },
      {
        name: 'index_refresh',
        keys: [
          'index_segment_refresh_total_time',
          'index_segment_refresh_primaries_time'
        ]
      },
      {
        name: 'index_disk',
        keys: [
          'index_store_total_size',
          'index_store_primaries_size',
          'index_segment_merge_total_size',
          'index_segment_merge_primaries_size'
        ]
      },
      {
        name: 'index_segment_count',
        keys: [
          'index_segment_count_total',
          'index_segment_count_primaries'
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

uiRoutes.when('/elasticsearch/indices/:index/advanced', {
  template,
  resolve: {
    clusters: function (Private) {
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
    $scope.indexName = $route.current.params.index;
    $scope.pageData = $route.current.locals.pageData;

    const title = $injector.get('title');
    title($scope.cluster, `Elasticsearch - Indices - ${$scope.indexName} - Advanced`);

    const $executor = $injector.get('$executor');
    $executor.register({
      execute: () => getPageData($injector),
      handleResponse: (response) => $scope.pageData = response
    });

    $executor.start();

    $scope.$on('$destroy', $executor.destroy);
  }
});
