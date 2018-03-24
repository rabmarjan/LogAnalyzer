import { uiModules } from 'ui/modules';
import template from './kbn_tabs.html';

const app = uiModules.get('xpack/watcher');

app.directive('kbnTabs', function () {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: template,
    scope: {
      selectedTabId: '=',
      onTabSelect: '='
    },
    controllerAs: 'kbnTabs',
    bindToController: true,
    controller: class KbnTabsController {
      constructor() {}

      isTabSelected = (tabId) => {
        return this.selectedTabId === tabId;
      }
    }
  };
});
