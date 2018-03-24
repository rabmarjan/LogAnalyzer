import Boom from 'boom';

export async function callEsSearchApi({ callCluster, index, body }) {
  try {
    return {
      ok: true,
      resp: await callCluster('search', {
        index,
        body
      })
    };
  } catch (error) {
    throw Boom.wrap(error, error.statusCode || 500);
  }
}
