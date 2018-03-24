import { uiModules } from 'ui/modules';
import { IndicesService } from './indices_service';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherIndicesService', ($injector) => {
    const $http = $injector.get('$http');
    return new IndicesService($http);
  });
