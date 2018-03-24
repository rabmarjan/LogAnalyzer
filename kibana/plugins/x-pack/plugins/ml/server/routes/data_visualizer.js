/*
 * ELASTICSEARCH CONFIDENTIAL
 *
 * Copyright (c) 2017 Elasticsearch BV. All Rights Reserved.
 *
 * Notice: this software, and all information contained
 * therein, is the exclusive property of Elasticsearch BV
 * and its licensors, if any, and is protected under applicable
 * domestic and foreign law, and international treaties.
 *
 * Reproduction, republication or distribution without the
 * express written consent of Elasticsearch BV is
 * strictly prohibited.
 */

import { callWithRequestFactory } from '../get_client_ml';
import { wrapError } from '../errors';
import { DataVisualizer } from '../models/data_visualizer';


function getOverallStats(
  callWithRequest,
  indexPatternTitle,
  query,
  aggregatableFields,
  nonAggregatableFields,
  samplerShardSize,
  timeFieldName,
  earliestMs,
  latestMs) {
  const dv = new DataVisualizer(callWithRequest);
  return dv.getOverallStats(
    indexPatternTitle,
    query,
    aggregatableFields,
    nonAggregatableFields,
    samplerShardSize,
    timeFieldName,
    earliestMs,
    latestMs
  );
}

function getStatsForFields(
  callWithRequest,
  indexPatternTitle,
  query,
  fields,
  samplerShardSize,
  timeFieldName,
  earliestMs,
  latestMs,
  interval,
  maxExamples) {
  const dv = new DataVisualizer(callWithRequest);
  return dv.getStatsForFields(
    indexPatternTitle,
    query,
    fields,
    samplerShardSize,
    timeFieldName,
    earliestMs,
    latestMs,
    interval,
    maxExamples
  );
}


export function dataVisualizerRoutes(server, commonRouteConfig) {

  server.route({
    method: 'POST',
    path: '/api/ml/data_visualizer/get_field_stats/{indexPatternTitle}',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const indexPatternTitle = request.params.indexPatternTitle;
      const payload = request.payload;
      return getStatsForFields(
        callWithRequest,
        indexPatternTitle,
        payload.query,
        payload.fields,
        payload.samplerShardSize,
        payload.timeFieldName,
        payload.earliest,
        payload.latest,
        payload.interval,
        payload.maxExamples)
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'POST',
    path: '/api/ml/data_visualizer/get_overall_stats/{indexPatternTitle}',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const indexPatternTitle = request.params.indexPatternTitle;
      const payload = request.payload;
      return getOverallStats(
        callWithRequest,
        indexPatternTitle,
        payload.query,
        payload.aggregatableFields,
        payload.nonAggregatableFields,
        payload.samplerShardSize,
        payload.timeFieldName,
        payload.earliest,
        payload.latest)
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

}
