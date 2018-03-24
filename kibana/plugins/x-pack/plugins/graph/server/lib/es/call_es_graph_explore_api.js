import Boom from 'boom';
import { get } from 'lodash';

export async function callEsGraphExploreApi({ callCluster, index, query }) {
  try {
    return {
      ok: true,
      resp: await callCluster('transport.request', {
        'path': '/' + encodeURIComponent(index) + '/_xpack/graph/_explore',
        body: query,
        method: 'POST',
        query: {}
      })
    };
  } catch (error) {
    // Extract known reasons for bad choice of field
    const relevantCause = [].concat(get(error, 'body.error.root_cause', []) || [])
      .find(cause => {
        return (
          cause.reason.includes('Fielddata is disabled on text fields') ||
          cause.reason.includes('No support for examining floating point') ||
          cause.reason.includes('Sample diversifying key must be a single valued-field') ||
          cause.reason.includes('Failed to parse query') ||
          cause.type == 'parsing_exception'
        );
      });

    if (relevantCause) {
      throw Boom.badRequest(relevantCause.reason);
    }

    throw Boom.wrap(error);
  }
}
