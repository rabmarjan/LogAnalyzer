import { uiModules } from 'ui/modules';

const module = uiModules.get('security', []);
module.service('shieldIndices', ($http, chrome) => {
  return {
    getFields: (query) => {
      return $http.get(chrome.addBasePath(`/api/security/v1/fields/${query}`))
        .then(response => response.data);
    }
  };
});
