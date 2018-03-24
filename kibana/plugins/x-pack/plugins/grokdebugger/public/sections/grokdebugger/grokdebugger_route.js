import routes from 'ui/routes';
import template from './grokdebugger_route.html';
import './components/grokdebugger';

routes
  .when('/dev_tools/grokdebugger', {
    template: template
  });
