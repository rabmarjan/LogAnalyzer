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

export function jobRoutes(server, commonRouteConfig) {

  server.route({
    method: 'GET',
    path: '/api/ml/anomaly_detectors',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      return callWithRequest('ml.jobs')
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'GET',
    path: '/api/ml/anomaly_detectors/{jobId}',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const jobId = request.params.jobId;
      return callWithRequest('ml.jobs', { jobId })
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'GET',
    path: '/api/ml/anomaly_detectors/_stats',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      return callWithRequest('ml.jobStats')
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'GET',
    path: '/api/ml/anomaly_detectors/{jobId}/_stats',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const jobId = request.params.jobId;
      return callWithRequest('ml.jobStats', { jobId })
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'PUT',
    path: '/api/ml/anomaly_detectors/{jobId}',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const jobId = request.params.jobId;
      const body = request.payload;
      return callWithRequest('ml.addJob', { jobId, body })
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'POST',
    path: '/api/ml/anomaly_detectors/{jobId}/_update',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const jobId = request.params.jobId;
      const body = request.payload;
      return callWithRequest('ml.updateJob', { jobId, body })
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'POST',
    path: '/api/ml/anomaly_detectors/{jobId}/_open',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const jobId = request.params.jobId;
      return callWithRequest('ml.openJob', { jobId })
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'POST',
    path: '/api/ml/anomaly_detectors/{jobId}/_close',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const options = {
        jobId: request.params.jobId
      };
      const force = request.query.force;
      if (force !== undefined) {
        options.force = force;
      }
      return callWithRequest('ml.closeJob', options)
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/ml/anomaly_detectors/{jobId}',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const options = {
        jobId: request.params.jobId
      };
      const force = request.query.force;
      if (force !== undefined) {
        options.force = force;
      }
      return callWithRequest('ml.deleteJob', options)
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'POST',
    path: '/api/ml/anomaly_detectors/_validate/detector',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const body = request.payload;
      return callWithRequest('ml.validateDetector', { body })
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'POST',
    path: '/api/ml/anomaly_detectors/{jobId}/_forecast',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const jobId = request.params.jobId;
      const duration = request.payload.duration;
      return callWithRequest('ml.forecast', { jobId, duration })
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

  server.route({
    method: 'POST',
    path: '/api/ml/anomaly_detectors/{jobId}/results/overall_buckets',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      return callWithRequest('ml.overallBuckets', {
        jobId: request.params.jobId,
        top_n: request.payload.topN,
        bucket_span: request.payload.bucketSpan,
        start: request.payload.start,
        end: request.payload.end
      })
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });

}
