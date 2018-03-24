import { find } from 'lodash';
import uiRoutes from'ui/routes';
import { routeInitProvider } from 'plugins/monitoring/lib/route_init';
import { MonitoringViewBaseTableController } from '../../';
import { getPageData } from './get_page_data';
import template from './index.html';

uiRoutes.when('/kibana/instances', {
  template,
  resolve: {
    clusters(Private) {
      const routeInit = Private(routeInitProvider);
      return routeInit();
    },
    pageData: getPageData,
  },
  controllerAs: 'kibanas',
  controller: class KibanaInstancesList extends MonitoringViewBaseTableController {

    constructor($injector, $scope) {
      super({
        title: 'Kibana Instances',
        storageKey: 'kibana.instances',
        getPageData,
        $scope,
        $injector
      });

      const $route = $injector.get('$route');
      this.data = $route.current.locals.pageData;
      const globalState = $injector.get('globalState');
      $scope.cluster = find($route.current.locals.clusters, { cluster_uuid: globalState.cluster_uuid });
      $scope.pageData = $route.current.locals.pageData;
    }
  }
});
