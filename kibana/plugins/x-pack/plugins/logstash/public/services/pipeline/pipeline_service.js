import chrome from 'ui/chrome';
import { ROUTES } from '../../../common/constants';
import { Pipeline } from 'plugins/logstash/models/pipeline';

export class PipelineService {
  constructor($http) {
    this.$http = $http;
    this.basePath = chrome.addBasePath(ROUTES.API_ROOT);
  }

  loadPipeline(id) {
    return this.$http.get(`${this.basePath}/pipeline/${id}`)
      .then(response => {
        return Pipeline.fromUpstreamJSON(response.data.pipeline);
      });
  }

  savePipeline(pipelineModel) {
    return this.$http.put(`${this.basePath}/pipeline/${pipelineModel.id}`, pipelineModel.upstreamJSON)
      .catch(e => {
        throw e.data.message;
      });
  }

  deletePipeline(id) {
    return this.$http.delete(`${this.basePath}/pipeline/${id}`)
      .catch(e => {
        throw e.data.message;
      });
  }
}
