export async function getServerStatus({ setup }) {
  const { client, config } = setup;

  const params = {
    index: config.get('xpack.apm.indexPattern'),
    body: {
      size: 0,
      query: {
        bool: {
          filter: {
            exists: {
              field: 'listening'
            }
          }
        }
      }
    }
  };

  const resp = await client('search', params);

  return {
    data_found: resp.hits.total >= 1
  };
}
