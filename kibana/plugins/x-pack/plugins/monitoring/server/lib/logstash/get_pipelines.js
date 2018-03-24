import { omit } from 'lodash';
import { checkParam } from '../error_missing_required';
import { getMetrics } from '../details/get_metrics';

async function fetchPipelinesWithMetrics(req, lsIndexPattern) {
  return await getMetrics(req, lsIndexPattern);
}

export function _handleResponse(response) {
  const pipelinesById = {};

  const metrics = Object.keys(response);
  metrics.forEach(metric => {
    response[metric][0].data.forEach(([x, y]) => {
      const pipelineIds = Object.keys(y);
      pipelineIds.forEach(pipelineId => {
        // Create new pipeline object if necessary
        if (!pipelinesById.hasOwnProperty(pipelineId)) {
          pipelinesById[pipelineId] = {
            metrics: {}
          };
        }
        const pipeline = pipelinesById[pipelineId];

        // Create new metric object in pipeline object if necessary
        if (!pipeline.metrics.hasOwnProperty(metric)) {
          // Clone the metric object from the response so we don't accidentally overwrite it
          // in the code further below. Also, reset data to empty array because we only want
          // to keep data "y" values specific to this pipeline
          pipeline.metrics[metric] = {
            ...omit(response[metric][0], 'data'),
            data: []
          };
        }

        pipeline.metrics[metric].data.push([ x, y[pipelineId] ]);
      });
    });
  });

  // Convert pipelinesById map to array
  const pipelines = [];
  Object.keys(pipelinesById).forEach(pipelineId => {
    pipelines.push({
      id: pipelineId,
      ...pipelinesById[pipelineId]
    });
  });

  return pipelines;
}

export async function getPipelines(req, logstashIndexPattern) {
  checkParam(logstashIndexPattern, 'logstashIndexPattern in getPipelines');

  const response = await fetchPipelinesWithMetrics(req, logstashIndexPattern);
  return _handleResponse(response);
}
