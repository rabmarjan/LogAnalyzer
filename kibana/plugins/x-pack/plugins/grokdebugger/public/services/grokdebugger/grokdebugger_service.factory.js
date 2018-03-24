import { uiModules } from 'ui/modules';
import { GrokdebuggerService } from './grokdebugger_service';

uiModules.get('xpack/grokdebugger')
  .factory('grokdebuggerService', ($injector) => {
    const $http = $injector.get('$http');
    return new GrokdebuggerService($http);
  });
