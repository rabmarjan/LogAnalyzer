import { uiModules } from 'ui/modules';
import { PipelinesService } from './pipelines_service';

uiModules.get('xpack/logstash')
  .factory('pipelinesService', ($injector) => {
    const $http = $injector.get('$http');
    return new PipelinesService($http);
  });
