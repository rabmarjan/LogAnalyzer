import { get } from 'lodash';
import chrome from 'ui/chrome';
import { XPackInfoSignatureProvider } from 'plugins/xpack_main/services/xpack_info_signature';
import { convertKeysToCamelCaseDeep } from '../../../../server/lib/key_case_converter';

const XPACK_INFO_KEY = 'xpackMain.info';

export function XPackInfoProvider($window, $injector, Private) {
  const xpackInfoSignature = Private(XPackInfoSignatureProvider);

  let inProgressRefreshPromise = null;

  const xpackInfo = {
    get(path, defaultValue) {
      const xpackInfoValuesJson = $window.sessionStorage.getItem(XPACK_INFO_KEY);
      const xpackInfoValues = xpackInfoValuesJson ? JSON.parse(xpackInfoValuesJson) : {};
      return get(xpackInfoValues, path, defaultValue);
    },

    setAll(updatedXPackInfo) {
      $window.sessionStorage.setItem(XPACK_INFO_KEY, JSON.stringify(updatedXPackInfo));
    },

    clear() {
      $window.sessionStorage.removeItem(XPACK_INFO_KEY);
    },

    refresh() {
      if (inProgressRefreshPromise) {
        return inProgressRefreshPromise;
      }

      // store the promise in a shared location so that calls to
      // refresh() before this is complete will get the same promise
      const $http = $injector.get('$http');
      inProgressRefreshPromise = (
        $http.get(chrome.addBasePath('/api/xpack/v1/info'))
          .catch((err) => {
          // if we are unable to fetch the updated info, we should
          // prevent reusing stale info
            xpackInfo.clear();
            xpackInfoSignature.clear();
            throw err;
          })
          .then((xpackInfoResponse) => {
            xpackInfo.setAll(convertKeysToCamelCaseDeep(xpackInfoResponse.data));
            xpackInfoSignature.set(xpackInfoResponse.headers('kbn-xpack-sig'));
          })
          .finally(() => {
            inProgressRefreshPromise = null;
          })
      );
      return inProgressRefreshPromise;
    }
  };

  xpackInfo.setAll(chrome.getInjected('xpackInitialInfo') || {});

  return xpackInfo;
}
