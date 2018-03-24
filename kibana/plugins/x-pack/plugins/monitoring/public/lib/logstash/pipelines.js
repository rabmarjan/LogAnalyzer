import { cloneDeep, last } from 'lodash';
import semver from 'semver';
import { LOGSTASH } from '../../../common/constants';

export function isPipelineMonitoringSupportedInVersion(logstashVersion) {
  const major = semver.major(logstashVersion);
  return major >= LOGSTASH.MAJOR_VER_REQD_FOR_PIPELINES;
}

export function processPipelinesAPIResponse(response, throughputMetricKey, nodesCountMetricKey) {
  // Clone to avoid mutating original response
  const processedResponse = cloneDeep(response);

  // Normalize metric names for shared component code
  // Calculate latest throughput and node count for each pipeline
  processedResponse.pipelines.forEach(pipeline => {
    pipeline.metrics = {
      throughput: pipeline.metrics[throughputMetricKey],
      nodesCount: pipeline.metrics[nodesCountMetricKey]
    };

    pipeline.latestThroughput = last(pipeline.metrics.throughput.data)[1];
    pipeline.latestNodesCount = last(pipeline.metrics.nodesCount.data)[1];
  });

  return processedResponse;
}
