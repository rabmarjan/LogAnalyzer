import { uiModules } from 'ui/modules';
import { FieldsService } from './fields_service';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherFieldsService', ($injector) => {
    const $http = $injector.get('$http');
    return new FieldsService($http);
  });
