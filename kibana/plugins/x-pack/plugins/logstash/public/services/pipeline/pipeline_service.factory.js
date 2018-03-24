import { uiModules } from 'ui/modules';
import { PipelineService } from './pipeline_service';

uiModules.get('xpack/logstash')
  .factory('pipelineService', ($injector) => {
    const $http = $injector.get('$http');
    return new PipelineService($http);
  });
