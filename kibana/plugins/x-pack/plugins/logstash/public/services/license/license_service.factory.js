import { uiModules } from 'ui/modules';
import { XPackInfoProvider } from 'plugins/xpack_main/services/xpack_info';
import 'ui/url';
import { LogstashLicenseService } from './logstash_license_service';

uiModules.get('xpack/logstash')
  .factory('logstashLicenseService', ($injector) => {
    const Private = $injector.get('Private');
    const xpackInfoService = Private(XPackInfoProvider);
    const kbnUrlService = $injector.get('kbnUrl');
    const $timeout = $injector.get('$timeout');

    return new LogstashLicenseService(xpackInfoService, kbnUrlService, $timeout);
  });
