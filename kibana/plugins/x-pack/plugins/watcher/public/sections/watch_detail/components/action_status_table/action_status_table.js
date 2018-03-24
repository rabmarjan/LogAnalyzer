import { uiModules } from 'ui/modules';
import template from './action_status_table.html';

const app = uiModules.get('xpack/watcher');

app.directive('actionStatusTable', function () {
  return {
    restrict: 'E',
    replace: true,
    template: template,
    scope: {
      actionStatuses: '=',
      sortField: '=',
      sortReverse: '=',
      onSortChange: '=',
      onActionAcknowledge: '=',
    },
    bindToController: true,
    controllerAs: 'actionStatusTable',
    controller: class ActionStatusTableController {}
  };
});
