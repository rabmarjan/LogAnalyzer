import { uiModules } from 'ui/modules';
import template from './watch_edit_watch_execute_summary.html';
import 'plugins/watcher/components/watch_state_icon';

const app = uiModules.get('xpack/watcher');

app.directive('watchEditWatchExecuteSummary', function () {
  return {
    restrict: 'E',
    replace: true,
    template: template,
    scope: {
      watchHistoryItem: '='
    },
    bindToController: true,
    controllerAs: 'watchEditWatchExecuteSummary',
    controller: class WatchEditWatchExecuteSummaryController {
      constructor() {}
    }
  };
});
