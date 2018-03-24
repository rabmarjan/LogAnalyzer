import routes from 'ui/routes';
import template from './testbed_route.html';
import './components/testbed';

routes
  .when('/management/elasticsearch/watches/testbed/:data?', {
    template: template,
    resolve: {
      data: function ($route) {
        return $route.current.params.data;
      }
    },
    controllerAs: 'testbedRoute',
    controller: class TestbedRouteController {
      constructor($injector) {
        const $route = $injector.get('$route');
        this.data = $route.current.locals.data;
      }
    }
  });
