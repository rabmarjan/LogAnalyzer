import { uiModules } from 'ui/modules';
import template from './watch_edit_title_bar.html';

const app = uiModules.get('xpack/watcher');

app.directive('watchEditTitleBar', function () {
  return {
    restrict: 'E',
    replace: true,
    template: template,
    scope: {
      watch: '=xpackWatch', // Property names differ due to https://git.io/vSWXV
      isWatchValid: '=',
      onWatchDelete: '=',
      onWatchSave: '=',
      onClose: '='
    },
    bindToController: true,
    controllerAs: 'watchEditTitleBar',
    controller: class WatchEditTitleBarController {
      constructor() {
      }
    }
  };
});
