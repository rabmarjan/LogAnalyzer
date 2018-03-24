import chrome from 'ui/chrome';
import { ROUTES } from '../../../common/constants';
import { PipelineListItem } from 'plugins/logstash/models/pipeline_list_item';

export class PipelinesService {
  constructor($http) {
    this.$http = $http;
    this.basePath = chrome.addBasePath(ROUTES.API_ROOT);
  }

  /**
   * Get a collection of pipelines
   */
  getPipelineList() {
    return this.$http.get(`${this.basePath}/pipelines`)
      .then(response => response.data.pipelines.map(pipeline => PipelineListItem.fromUpstreamJSON(pipeline)));
  }

  /**
   * Delete a collection of pipelines
   *
   * @param pipelineIds Array of pipeline IDs
   * @return Promise { numSuccesses, numErrors }
   */
  deletePipelines(pipelineIds) {
    // $http.delete does not take the request body as the 2nd argument. Instead it expects the 2nd
    // argument to be a request options object, one of which can be the request body (data). We also
    // need to explicity define the content type of the data.
    const requestOpts = {
      data: { pipelineIds },
      headers: { 'Content-Type': 'application/json' }
    };
    return this.$http.delete(`${this.basePath}/pipelines`, requestOpts)
      .then(response => response.data.results);
  }
}
