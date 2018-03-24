import Joi from 'joi';
import Boom from 'boom';

import {
  verifyApiAccessPre,
  getCallClusterPre,
  callEsSearchApi,
} from '../lib';

export const searchProxyRoute = {
  path: '/api/graph/searchProxy',
  method: 'POST',
  config: {
    pre: [
      getCallClusterPre,
      verifyApiAccessPre,
    ],
    validate: {
      payload: Joi.object().keys({
        index: Joi.string().required(),
        body: Joi.object().unknown(true).default()
      }).default()
    },
    handler(request, reply) {
      reply(callEsSearchApi({
        callCluster: request.pre.callCluster,
        index: request.payload.index,
        body: request.payload.body
      }));
    }
  }
};
