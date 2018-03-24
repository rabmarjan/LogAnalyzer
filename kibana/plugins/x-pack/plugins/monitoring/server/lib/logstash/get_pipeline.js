import boom from 'boom';
import { get } from 'lodash';
import { checkParam } from '../error_missing_required';
import { getPipelineStateDocument } from './get_pipeline_state_document';
import { getPipelineStatsAggregation } from './get_pipeline_stats_aggregation';
import { getPipelineVersions } from './get_pipeline_versions';

export function _vertexStats(vertex, vertexStatsBucket, totalProcessorsDurationInMillis, timeboundsInMillis) {

  const isInput = vertex.plugin_type === 'input';
  const isProcessor = vertex.plugin_type === 'filter' || vertex.plugin_type === 'output';

  const eventsInTotal = vertexStatsBucket.events_in_total.value;
  const eventsOutTotal = get(vertexStatsBucket, 'events_out_total.value', null);
  const eventsTotal = eventsOutTotal || eventsInTotal;

  const durationInMillis = vertexStatsBucket.duration_in_millis_total.value;

  const inputStats = {};
  const processorStats = {};

  if (isInput) {
    inputStats.queue_push_duration_in_millis = vertexStatsBucket.queue_push_duration_in_millis_total.value;
    inputStats.queue_push_duration_in_millis_per_event = inputStats.queue_push_duration_in_millis / eventsTotal;
  }

  if (isProcessor) {
    processorStats.percent_of_total_processor_duration = durationInMillis / totalProcessorsDurationInMillis;
  }

  return {
    events_in: eventsInTotal,
    events_out: eventsOutTotal,
    duration_in_millis: durationInMillis,
    events_per_millisecond: eventsTotal / timeboundsInMillis,
    millis_per_event: durationInMillis / eventsTotal,
    ...inputStats,
    ...processorStats
  };
}

export function _enrichStateWithStatsAggregation(stateDocument, statsAggregation) {
  const vertexStatsByIdBuckets = statsAggregation.aggregations.pipelines.scoped.vertices.vertex_id.buckets;
  const logstashState = stateDocument.logstash_state;
  const vertices = logstashState.pipeline.representation.graph.vertices;

  const timebounds = statsAggregation.aggregations.pipelines.scoped.timebounds;
  const timeboundsInMillis = timebounds.last_seen.value - timebounds.first_seen.value;

  const rootAgg = statsAggregation.aggregations;
  const scopedAgg = rootAgg.pipelines.scoped;

  const durationStats = scopedAgg.events_duration;
  const totalProcessorsDurationInMillis = durationStats.max - durationStats.min;
  durationStats.duration = totalProcessorsDurationInMillis;

  const verticesById = {};
  vertices.forEach(vertex => {
    verticesById[vertex.id] = vertex;
  });

  vertexStatsByIdBuckets.forEach(vertexStatsBucket => {
    const id = vertexStatsBucket.key;
    const vertex = verticesById[id];

    if (vertex !== undefined) {
      vertex.stats = _vertexStats(vertex, vertexStatsBucket, totalProcessorsDurationInMillis, timeboundsInMillis);
    }
  });

  return stateDocument.logstash_state;
}

export async function getPipeline(req, config, lsIndexPattern, clusterUuid, pipelineId, pipelineHash) {
  checkParam(lsIndexPattern, 'lsIndexPattern in getPipeline');

  const { callWithRequest } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const versions = await getPipelineVersions(callWithRequest, req, config, lsIndexPattern, clusterUuid, pipelineId);
  if (!pipelineHash) {
    pipelineHash = versions[0].hash;
  }

  const options = {
    clusterUuid,
    pipelineId,
    pipelineHash
  };

  const [ stateDocument, statsAggregation ] = await Promise.all([
    getPipelineStateDocument(callWithRequest, req, lsIndexPattern, options),
    getPipelineStatsAggregation(callWithRequest, req, lsIndexPattern, options)
  ]);

  if (stateDocument === null) {
    return boom.notFound(`Pipeline [${pipelineId} @ ${pipelineHash}] not found in the selected time range for cluster [${clusterUuid}].`);
  }

  const result = {
    ..._enrichStateWithStatsAggregation(stateDocument, statsAggregation),
    versions
  };
  return result;
}
