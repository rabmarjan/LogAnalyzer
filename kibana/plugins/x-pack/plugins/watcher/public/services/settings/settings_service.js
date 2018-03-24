import chrome from 'ui/chrome';
import { ROUTES } from '../../../common/constants';
import { Settings } from 'plugins/watcher/models/settings';

export class SettingsService {
  constructor($http) {
    this.$http = $http;
    this.basePath = chrome.addBasePath(ROUTES.API_ROOT);
  }

  getSettings() {
    return this.$http.get(`${this.basePath}/settings`)
      .then(response => {
        return Settings.fromUpstreamJson(response.data);
      });
  }
}
