import { uiModules } from 'ui/modules';
import template from './kbn_tab.html';

const app = uiModules.get('xpack/watcher');

app.directive('kbnTab', function () {
  return {
    require: '^^kbnTabs',
    restrict: 'E',
    transclude: true,
    replace: true,
    template: template,
    scope: {
      tabId: '@',
      title: '@'
    },
    controllerAs: 'kbnTab',
    bindToController: true,
    controller: class KbnTabController {},
    link: function ($scope, $ele, attrs, kbnTabs) {
      $scope.kbnTabs = kbnTabs;
    }
  };
});
