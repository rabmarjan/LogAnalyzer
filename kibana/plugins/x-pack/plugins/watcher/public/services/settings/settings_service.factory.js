import { uiModules } from 'ui/modules';
import { SettingsService } from './settings_service';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherSettingsService', ($injector) => {
    const $http = $injector.get('$http');
    return new SettingsService($http);
  });
