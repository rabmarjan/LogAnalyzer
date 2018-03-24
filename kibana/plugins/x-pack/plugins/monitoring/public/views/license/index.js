import { find, get } from 'lodash';
import uiRoutes from'ui/routes';
import { routeInitProvider } from 'plugins/monitoring/lib/route_init';
import template from './index.html';

uiRoutes.when('/license', {
  template,
  resolve: {
    clusters(Private) {
      const routeInit = Private(routeInitProvider);
      return routeInit();
    }
  },
  controller($injector, $scope) {
    const timefilter = $injector.get('timefilter');
    timefilter.disableTimeRangeSelector();
    timefilter.disableAutoRefreshSelector();

    const $route = $injector.get('$route');
    const globalState = $injector.get('globalState');
    $scope.cluster = find($route.current.locals.clusters, { cluster_uuid: globalState.cluster_uuid });

    $scope.isExpired = Date.now() > get($scope.cluster, 'license.expiry_date_in_millis');

    $scope.goBack = function () {
      const $window = $injector.get('$window');
      $window.history.back();
    };

    const title = $injector.get('title');
    title($scope.cluster, 'License');
  }
});
