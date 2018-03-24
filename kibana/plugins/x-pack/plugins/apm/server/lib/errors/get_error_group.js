import { SERVICE_NAME, ERROR_GROUP_ID } from '../../../common/constants';
import { get } from 'lodash';

export async function getErrorGroup({ serviceName, groupId, setup }) {
  const { start, end, client, config } = setup;

  const params = {
    index: config.get('xpack.apm.indexPattern'),
    body: {
      size: 1,
      query: {
        bool: {
          filter: [
            { term: { [SERVICE_NAME]: serviceName } },
            { term: { [ERROR_GROUP_ID]: groupId } },
            {
              range: {
                '@timestamp': {
                  gte: start,
                  lte: end,
                  format: 'epoch_millis'
                }
              }
            }
          ]
        }
      },
      sort: [
        {
          '@timestamp': 'desc'
        }
      ]
    }
  };

  const resp = await client('search', params);

  return {
    error: get(resp, 'hits.hits[0]._source', {}),
    occurrences_count: get(resp, 'hits.total'),
    group_id: get(resp, `hits.hits[0]._source.${ERROR_GROUP_ID}`)
  };
}
