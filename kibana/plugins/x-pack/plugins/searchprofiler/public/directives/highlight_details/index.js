import _ from 'lodash';
import template from 'plugins/searchprofiler/directives/highlight_details/index.html';
import { uiModules } from 'ui/modules';

const uiModule = uiModules.get('app/searchprofiler/directives', []);
uiModule.directive('highlightdetails', HighlightService => {
  return {
    restrict: 'E',
    scope: {
      data: '@'
    },
    template: template,
    link: $scope => {

      function render(data) {
        if (!data) {
          return;
        }
        data.breakdown = _.filter(data.breakdown, o => o.key.indexOf('_count') === -1);
        $scope.detailRow = data;
      }

      $scope.$watch(() => {
        return HighlightService.details;
      }, render);

    }
  };
});
