import { TRANSACTION_ID, PROCESSOR_EVENT } from '../../../common/constants';
import { get } from 'lodash';

async function getTransaction({ transactionId, setup }) {
  const { start, end, client, config } = setup;

  const params = {
    index: config.get('xpack.apm.indexPattern'),
    body: {
      size: 1,
      query: {
        bool: {
          filter: [
            { term: { [PROCESSOR_EVENT]: 'transaction' } },
            { term: { [TRANSACTION_ID]: transactionId } },
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
      }
    }
  };
  const resp = await client('search', params);
  return get(resp, 'hits.hits[0]._source', {});
}

export default getTransaction;
