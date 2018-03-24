import 'angular-resource';
import { uiModules } from 'ui/modules';

const module = uiModules.get('security', ['ngResource']);
module.service('ShieldRole', ($resource, chrome) => {
  return $resource(chrome.addBasePath('/api/security/v1/roles/:name'), {
    name: '@name'
  });
});
