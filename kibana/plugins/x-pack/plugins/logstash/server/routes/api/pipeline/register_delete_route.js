import { callWithRequestFactory } from '../../../lib/call_with_request_factory';
import { wrapEsError } from '../../../lib/error_wrappers';
import { INDEX_NAMES, TYPE_NAMES } from '../../../../common/constants';
import { licensePreRoutingFactory } from'../../../lib/license_pre_routing_factory';

function deletePipeline(callWithRequest, pipelineId) {
  return callWithRequest('delete', {
    index: INDEX_NAMES.PIPELINES,
    type: TYPE_NAMES.PIPELINES,
    id: pipelineId,
    refresh: 'wait_for'
  });
}

export function registerDeleteRoute(server) {
  const licensePreRouting = licensePreRoutingFactory(server);

  server.route({
    path: '/api/logstash/pipeline/{id}',
    method: 'DELETE',
    handler: (request, reply) => {
      const callWithRequest = callWithRequestFactory(server, request);
      const pipelineId = request.params.id;

      return deletePipeline(callWithRequest, pipelineId)
        .then(reply)
        .catch(e => reply(wrapEsError(e)));
    },
    config: {
      pre: [ licensePreRouting ]
    }
  });
}
