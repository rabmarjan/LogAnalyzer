import { contains } from 'lodash';
import { uiModules } from 'ui/modules';
import { ML_SUPPORTED_LICENSES } from 'monitoring-constants';

const uiModule = uiModules.get('monitoring/license', []);
uiModule.service('license', () => {
  let licenseType;

  return {
    isBasic() {
      return licenseType === 'basic';
    },

    mlIsSupported() {
      return contains(ML_SUPPORTED_LICENSES, licenseType);
    },

    setLicenseType(newType) {
      licenseType = newType;
    }
  };
});
