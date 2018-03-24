import _ from 'lodash';
import { getClient } from '../../../../../../server/lib/get_client_shield';
import { wrapError } from '../../../lib/errors';

export function initIndicesApi(server) {
  const callWithRequest = getClient(server).callWithRequest;

  server.route({
    method: 'GET',
    path: '/api/security/v1/fields/{query}',
    handler(request, reply) {
      return callWithRequest(request, 'indices.getFieldMapping', {
        index: request.params.query,
        fields: '*',
        allowNoIndices: false,
        includeDefaults: true
      })
        .then((mappings) => reply(
          _(mappings)
            .map('mappings')
            .map(_.values)
            .flatten()
            .map(_.keys)
            .flatten()
            .uniq()
            .value()
        ))
        .catch(_.flow(wrapError, reply));
    }
  });
}
