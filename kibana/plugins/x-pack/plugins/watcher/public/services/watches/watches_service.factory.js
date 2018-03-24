import { uiModules } from 'ui/modules';
import { WatchesService } from './watches_service';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherWatchesService', ($injector) => {
    const $http = $injector.get('$http');
    return new WatchesService($http);
  });
