import { uiModules } from 'ui/modules';
import { XPackInfoProvider } from 'plugins/xpack_main/services/xpack_info';
import 'ui/url';
import { LicenseService } from './license_service';

uiModules.get('xpack/watcher')
  .factory('xpackWatcherLicenseService', ($injector) => {
    const $http = $injector.get('$http');
    const Private = $injector.get('Private');
    const xpackInfoService = Private(XPackInfoProvider);
    const kbnUrlService = $injector.get('kbnUrl');
    const $timeout = $injector.get('$timeout');

    return new LicenseService(xpackInfoService, kbnUrlService, $timeout, $http);
  });
