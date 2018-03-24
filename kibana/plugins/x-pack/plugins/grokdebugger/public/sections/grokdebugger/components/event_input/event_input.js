import { uiModules } from 'ui/modules';
import template from './event_input.html';
import './event_input.less';
import 'ace';

const app = uiModules.get('xpack/grokdebugger');

app.directive('eventInput', function () {
  return {
    restrict: 'E',
    template: template,
    scope: {
      onChange: '='
    },
    bindToController: true,
    controllerAs: 'eventInput',
    controller: class EventInputController {
      constructor($scope) {
        $scope.$watch('eventInput.rawEvent', (newRawEvent) => {
          this.onChange(newRawEvent);
        });
        $scope.aceLoaded = (editor) => {
          this.editor = editor;
          editor.getSession().setUseWrapMode(true);
          editor.setOptions({
            highlightActiveLine: false,
            highlightGutterLine: false,
            minLines: 3,
            maxLines: 10
          });
          editor.$blockScrolling = Infinity;
        };
      }
    }
  };
});
