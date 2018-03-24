import { uiModules } from 'ui/modules';
import template from './options.html';

const module = uiModules.get('xpack/reporting');

module.directive('pdfOptions', () => {
  return {
    restrict: 'E',
    template,
    link: function ($scope) {
      if (!$scope.options.layoutId) {
        $scope.options.layoutId = 'print';
      }
    }
  };
});
