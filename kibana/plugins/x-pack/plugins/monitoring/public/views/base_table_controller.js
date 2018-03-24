import { MonitoringViewBaseController } from './';
import { tableStorageGetter, tableStorageSetter } from 'plugins/monitoring/components/table';

/**
 * Class to manage common instantiation behaviors in a view controller
 * And add persistent state to a table:
 * - page index: in table pagination, which page are we looking at
 * - filter text: what filter was entered in the table's filter bar
 * - sortKey: which column field of table data is used for sorting
 * - sortOrder: is sorting ordered ascending or descending
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
export class MonitoringViewBaseTableController extends MonitoringViewBaseController {

  /**
   * Create a table view controller
   * @param {Object} opts
   * - used by parent class:
   * @param {String} opts.title - Title of the page
   * @param {Function} opts.getPageData - Function to fetch page data
   * @param {Service} opts.$injector - Angular dependency injection service
   * @param {Service} opts.$scope - Angular view data binding service
   * @param {Object} opts.options
   * @param {Boolean} opts.options.enableTimeFilter - Whether to show the time filter
   * @param {Boolean} opts.options.enableAutoRefresh - Whether to show the auto refresh control
   * - specific to this class:
   * @param {String} opts.storageKey - the namespace that will be used to keep the state data in the Monitoring localStorage object
   *
   */
  constructor(args) {
    super(args);
    const { storageKey, $injector } = args;
    const storage = $injector.get('localStorage');

    const getLocalStorageData = tableStorageGetter(storageKey);
    const setLocalStorageData = tableStorageSetter(storageKey);
    const { pageIndex, filterText, sortKey, sortOrder } = getLocalStorageData(storage);

    this.pageIndex = pageIndex;
    this.filterText = filterText;
    this.sortKey = sortKey;
    this.sortOrder = sortOrder;

    this.onNewState = newState => {
      setLocalStorageData(storage, newState);
    };
  }

}
