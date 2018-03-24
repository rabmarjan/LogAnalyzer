import { uiModules } from 'ui/modules';
import { InitAfterBindingsWorkaround } from 'ui/compat';
import template from './custom_patterns_input.html';
import './custom_patterns_input.less';
import 'ui/toggle_panel';
import 'ace';

const app = uiModules.get('xpack/grokdebugger');

app.directive('customPatternsInput', function () {
  return {
    restrict: 'E',
    template: template,
    scope: {
      onChange: '='
    },
    bindToController: true,
    controllerAs: 'customPatternsInput',
    controller: class CustomPatternsInputController extends InitAfterBindingsWorkaround {
      initAfterBindings($scope) {
        this.isCollapsed = {
          action: true
        };
        $scope.$watch('customPatternsInput.customPatterns', () => {
          this.onChange(this.customPatterns);
        });
        $scope.aceLoaded = (editor) => {
          this.editor = editor;
          editor.getSession().setUseWrapMode(true);
          editor.setOptions({
            highlightActiveLine: false,
            highlightGutterLine: false,
            minLines: 3,
            maxLines: 25
          });
          editor.$blockScrolling = Infinity;
        };
      }

      onSectionToggle = (sectionId) => {
        this.isCollapsed[sectionId] = !this.isCollapsed[sectionId];
      }

      isSectionCollapsed = (sectionId) => {
        return this.isCollapsed[sectionId];
      }
    }
  };
});
