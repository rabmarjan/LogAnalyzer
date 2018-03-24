import { uiModules } from 'ui/modules';
import { XPackInfoProvider } from 'plugins/xpack_main/services/xpack_info';
import { LogstashSecurityService } from './logstash_security_service';

uiModules.get('xpack/logstash')
  .factory('logstashSecurityService', ($injector) => {
    const Private = $injector.get('Private');
    const xpackInfoService = Private(XPackInfoProvider);

    return new LogstashSecurityService(xpackInfoService);
  });
