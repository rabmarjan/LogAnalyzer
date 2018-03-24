import { SERVICE_NAME, TRANSACTION_TYPE } from '../../../common/constants';

export async function getService({ serviceName, setup }) {
  const { start, end, client, config } = setup;

  const params = {
    index: config.get('xpack.apm.indexPattern'),
    body: {
      size: 0,
      query: {
        bool: {
          filter: [
            { term: { [SERVICE_NAME]: serviceName } },
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
      aggs: {
        types: {
          terms: { field: TRANSACTION_TYPE, size: 100 }
        }
      }
    }
  };

  const resp = await client('search', params);
  return {
    service_name: serviceName,
    types: resp.aggregations.types.buckets.map(bucket => bucket.key)
  };
}
