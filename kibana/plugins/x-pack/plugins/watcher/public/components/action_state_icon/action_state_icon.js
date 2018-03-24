import { uiModules } from 'ui/modules';
import template from './action_state_icon.html';
import { ACTION_STATES } from 'plugins/watcher/../common/constants';

const app = uiModules.get('xpack/watcher');

app.directive('actionStateIcon', function () {
  return {
    restrict: 'E',
    replace: true,
    template: template,
    scope: {
      actionStatus: '='
    },
    bindToController: true,
    controllerAs: 'actionStateIcon',
    controller: class ActionStateIconController {
      constructor() {
        this.ACTION_STATES = ACTION_STATES;
      }
    }
  };
});
