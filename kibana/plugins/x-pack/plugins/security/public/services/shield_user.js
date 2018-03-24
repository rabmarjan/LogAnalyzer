import 'angular-resource';
import angular from 'angular';
import { uiModules } from 'ui/modules';

const module = uiModules.get('security', ['ngResource']);
module.service('ShieldUser', ($resource, chrome) => {
  const baseUrl = chrome.addBasePath('/api/security/v1/users/:username');
  const ShieldUser = $resource(baseUrl, {
    username: '@username'
  }, {
    changePassword: {
      method: 'POST',
      url: `${baseUrl}/password`,
      transformRequest: ({ password, newPassword }) => angular.toJson({ password, newPassword })
    },
    getCurrent: {
      method: 'GET',
      url: chrome.addBasePath('/api/security/v1/me')
    }
  });

  return ShieldUser;
});
