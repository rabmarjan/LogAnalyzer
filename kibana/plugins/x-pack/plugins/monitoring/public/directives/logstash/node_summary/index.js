import template from './index.html';
import { uiModules } from 'ui/modules';

const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('monitoringLogstashNodeSummary', () => {
  return {
    restrict: 'E',
    template: template,
    scope: {
      logstash: '='
    }
  };
});
