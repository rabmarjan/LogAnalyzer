import Joi from 'joi';

import {
  verifyApiAccessPre,
  getCallClusterPre,
  callEsGraphExploreApi,
} from '../lib';

export const graphExploreRoute = {
  path: '/api/graph/graphExplore',
  method: 'POST',
  config: {
    pre: [
      verifyApiAccessPre,
      getCallClusterPre,
    ],
    validate: {
      payload: Joi.object().keys({
        index: Joi.string().required(),
        query: Joi.object().required().unknown(true)
      }).default()
    },
    handler(request, reply) {
      reply(callEsGraphExploreApi({
        callCluster: request.pre.callCluster,
        index: request.payload.index,
        query: request.payload.query,
      }));
    }
  }
};
