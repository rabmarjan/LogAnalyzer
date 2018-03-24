import { uiModules } from 'ui/modules';
import template from './forbidden_message.html';

const app = uiModules.get('xpack/watcher');

app.directive('forbiddenMessage', function () {
  return {
    restrict: 'E',
    replace: true,
    template: template,
    transclude: true,
    scope: {},
    controllerAs: 'forbiddenMessage',
    bindToController: true,
    controller: class ForbiddenMessageController {
      constructor() { }
    }
  };
});
