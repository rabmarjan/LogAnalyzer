import { uiModules } from 'ui/modules';
import { WatchService } from './watch_service';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherWatchService', ($injector) => {
    const $http = $injector.get('$http');
    return new WatchService($http);
  });
