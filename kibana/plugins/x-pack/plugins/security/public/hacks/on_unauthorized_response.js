import { identity } from 'lodash';
import { uiModules } from 'ui/modules';
import { PathProvider } from 'plugins/xpack_main/services/path';
import 'plugins/security/services/auto_logout';

function isUnauthorizedResponseAllowed(response) {
  const API_WHITELIST = [
    '/api/security/v1/login',
    '/api/security/v1/users/.*/password'
  ];

  const url = response.config.url;
  return API_WHITELIST.some(api => url.match(api));
}

const module = uiModules.get('security');
module.factory('onUnauthorizedResponse', ($q, $window, $injector, Private, autoLogout) => {
  const isLoginOrLogout = Private(PathProvider).isLoginOrLogout();
  function interceptorFactory(responseHandler) {
    return function interceptor(response) {
      if (response.status === 401 && !isUnauthorizedResponseAllowed(response) && !isLoginOrLogout) return autoLogout();
      return responseHandler(response);
    };
  }

  return {
    response: interceptorFactory(identity),
    responseError: interceptorFactory($q.reject)
  };
});

module.config(($httpProvider) => {
  $httpProvider.interceptors.push('onUnauthorizedResponse');
});
