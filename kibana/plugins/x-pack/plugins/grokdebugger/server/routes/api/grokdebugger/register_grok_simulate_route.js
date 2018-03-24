import { wrapEsError } from '../../../lib/error_wrappers';
import { callWithRequestFactory } from '../../../lib/call_with_request_factory';
import { GrokdebuggerRequest } from '../../../models/grokdebugger_request';
import { GrokdebuggerResponse } from '../../../models/grokdebugger_response';

function simulateGrok(callWithRequest, ingestJson) {
  return callWithRequest('ingest.simulate', {
    body: ingestJson
  });
}

export function registerGrokSimulateRoute(server) {
  server.route({
    path: '/api/grokdebugger/simulate',
    method: 'POST',
    handler: (request, reply) => {
      const callWithRequest = callWithRequestFactory(server, request);
      const grokdebuggerRequest = GrokdebuggerRequest.fromDownstreamJSON(request.payload);
      return simulateGrok(callWithRequest, grokdebuggerRequest.upstreamJSON)
        .then((simulateResponseFromES) => {
          const grokdebuggerResponse = GrokdebuggerResponse.fromUpstreamJSON(simulateResponseFromES);
          reply({ grokdebuggerResponse });
        })
        .catch(e => reply(wrapEsError(e)));
    }
  });
}
