import { uiModules } from 'ui/modules';
import template from './index.html';

const uiModule = uiModules.get('monitoring/directives', []);
uiModule.directive('monitoringIndexSummary', () => {
  return {
    restrict: 'E',
    template: template,
    scope: { summary: '=' }
  };
});

