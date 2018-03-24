import { uiModules } from 'ui/modules';
import template from './testbed.html';
import './testbed.less';

const app = uiModules.get('xpack/watcher');

app.directive('testbed', function () {

  return {
    restrict: 'E',
    template: template,
    scope: {
    },
    bindToController: true,
    controllerAs: 'testbed',
    controller: class TestbedController {
      constructor() {
      }
    }
  };
});
