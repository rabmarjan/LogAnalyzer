import { uiModules } from 'ui/modules';
import template from './json_editor.html';
import './json_editor.less';
import 'ace';

const app = uiModules.get('xpack/watcher');

app.directive('jsonEditor', function () {
  return {
    restrict: 'E',
    template: template,
    replace: true,
    scope: {
      json: '=',
      onChange: '=',
      onValid: '=',
      onInvalid: '='
    },
    bindToController: true,
    controllerAs: 'jsonEditor',
    controller: class JsonEditorController {
      constructor($scope) {
        $scope.aceLoaded = (editor) => {
          this.editor = editor;
          editor.$blockScrolling = Infinity;
        };

        $scope.$watch('jsonEditor.form.$valid', () => {
          if (this.form.$invalid) {
            this.onInvalid();
          } else {
            this.onValid();
          }
        });

        $scope.$watch('jsonEditor.json', () => {
          this.onChange(this.json);
        });
      }
    }
  };
});
