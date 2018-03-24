import { uiModules } from 'ui/modules';
import template from './tool_bar_selected_count.html';

const app = uiModules.get('xpack/watcher');

app.directive('toolBarSelectedCount', function () {
  return {
    restrict: 'E',
    replace: true,
    template: template,
    scope: {
      count: '=',
      singularName: '@',
      pluralName: '@',
    },
    controllerAs: 'toolBarSelectedCount',
    bindToController: true,
    controller: class ToolBarSelectedCountController {
    }
  };
});
