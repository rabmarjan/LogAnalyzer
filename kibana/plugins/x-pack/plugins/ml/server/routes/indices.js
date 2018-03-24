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

export function indicesRoutes(server, commonRouteConfig) {

  server.route({
    method: 'GET',
    path: '/api/ml/indices',
    handler(request, reply) {
      const callWithRequest = callWithRequestFactory(server, request);
      const params = { index: '*', filterPath: '*.mappings,*.aliases' };
      return callWithRequest('indices.get', params)
        .then(resp => reply(resp))
        .catch(resp => reply(wrapError(resp)));
    },
    config: {
      ...commonRouteConfig
    }
  });
}
