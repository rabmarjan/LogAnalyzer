import { uiModules } from 'ui/modules';
import { XpackWatcherTimezoneService } from './xpack_watcher_timezone_service';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherTimezoneService', ($injector) => {
    const config = $injector.get('config');
    return new XpackWatcherTimezoneService(config);
  });
