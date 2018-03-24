import { callWithRequestFactory } from '../../../lib/call_with_request_factory';
import { wrapUnknownError } from '../../../lib/error_wrappers';
import { INDEX_NAMES, TYPE_NAMES } from '../../../../common/constants';
import { licensePreRoutingFactory } from'../../../lib/license_pre_routing_factory';

function deletePipelines(callWithRequest, pipelineIds) {
  const deletePromises = pipelineIds.map(pipelineId => {
    return callWithRequest('delete', {
      index: INDEX_NAMES.PIPELINES,
      type: TYPE_NAMES.PIPELINES,
      id: pipelineId,
      refresh: 'wait_for'
    })
      .then(success => ({ success }))
      .catch(error => ({ error }));
  });

  return Promise.all(deletePromises)
    .then(results => {
      const successes = results.filter(result => Boolean(result.success));
      const errors = results.filter(result => Boolean(result.error));

      return {
        numSuccesses: successes.length,
        numErrors: errors.length
      };
    });
}

export function registerDeleteRoute(server) {
  const licensePreRouting = licensePreRoutingFactory(server);

  server.route({
    path: '/api/logstash/pipelines',
    method: 'DELETE',
    handler: (request, reply) => {
      const callWithRequest = callWithRequestFactory(server, request);

      return deletePipelines(callWithRequest, request.payload.pipelineIds)
        .then(results => {
          reply({ results });
        })
        .catch(err => {
          reply(wrapUnknownError(err));
        });
    },
    config: {
      pre: [ licensePreRouting ]
    }
  });
}
