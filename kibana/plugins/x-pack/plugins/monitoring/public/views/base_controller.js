/**
 * Class to manage common instantiation behaviors in a view controller
 *
 * This is expected to be extended, and behavior enabled using super();
 *
 * Example:
 * uiRoutes.when('/myRoute', {
 *   template: importedTemplate,
 *   controllerAs: 'myView',
 *   controller: class MyView extends MonitoringViewBaseController {
 *     constructor($injector, $scope) {
 *       super({
 *         title: 'Hello World',
 *         getPageData: getPageDataFunction,
 *         $scope,
 *         $injector,
 *         options: {
 *           enableTimeFilter: false // this will have just the page auto-refresh control show
 *         }
 *       });
 *     }
 *   }
 * });
 */
export class MonitoringViewBaseController {

  /**
   * Create a view controller
   * @param {Object} opts
   * @param {String} opts.title - Title of the page
   * @param {Function} opts.getPageData - Function to fetch page data
   * @param {Service} opts.$injector - Angular dependency injection service
   * @param {Service} opts.$scope - Angular view data binding service
   * @param {Object} opts.options
   * @param {Boolean} opts.options.enableTimeFilter - Whether to show the time filter
   * @param {Boolean} opts.options.enableAutoRefresh - Whether to show the auto refresh control
   */
  constructor({
    title = '',
    getPageData,
    $injector,
    $scope,
    options = {
      enableTimeFilter: true,
      enableAutoRefresh: true,
    }
  }) {
    const titleService = $injector.get('title');
    const timefilter = $injector.get('timefilter');
    const $executor = $injector.get('$executor');

    titleService($scope.cluster, title);

    // if configured to be disabled, time filter controls must explicitly be
    // disabled, as previous view having it enabled would otherwise leave it enabled
    if (options.enableTimeFilter === false) {
      timefilter.disableTimeRangeSelector();
    } else {
      timefilter.enableTimeRangeSelector();
    }

    if (options.enableAutoRefresh === false) {
      timefilter.disableAutoRefreshSelector();
    } else {
      timefilter.enableAutoRefreshSelector();
    }

    this.updateData = () => {
      return getPageData($injector).then(pageData => this.data = pageData);
    };

    $executor.register({
      execute: () => this.updateData()
    });
    $executor.start();
    $scope.$on('$destroy', $executor.destroy);
  }

}
