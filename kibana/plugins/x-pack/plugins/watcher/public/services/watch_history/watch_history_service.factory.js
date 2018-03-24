import { uiModules } from 'ui/modules';
import { WatchHistoryService } from './watch_history_service';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherWatchHistoryService', ($injector) => {
    const $http = $injector.get('$http');
    return new WatchHistoryService($http);
  });
