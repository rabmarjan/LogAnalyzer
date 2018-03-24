import { uiModules } from 'ui/modules';
import template from './watch_history_item_detail.html';
import './watch_history_item_detail.less';
import 'ace';

const app = uiModules.get('xpack/watcher');

app.directive('watchHistoryItemDetail', function () {
  return {
    restrict: 'E',
    template: template,
    scope: {
      watchHistoryItem: '='
    },
    bindToController: true,
    controllerAs: 'watchHistoryItemDetail',
    controller: class WatchHistoryItemDetailController {
      constructor($scope) {
        $scope.aceLoaded = (editor) => {
          this.editor = editor;
          editor.$blockScrolling = Infinity;
        };
      }
    }
  };
});
