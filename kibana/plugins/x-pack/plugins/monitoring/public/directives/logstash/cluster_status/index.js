import { uiModules } from 'ui/modules';
import template from './index.html';

const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('monitoringClusterStatusLogstash', () => {
  return {
    restrict: 'E',
    template,
    scope: {
      status: '='
    }
  };
});
