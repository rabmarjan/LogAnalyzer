import { constants } from '../constants';

const schema = {
  jobtype: { type: 'keyword' },
  payload: { type: 'object', enabled: false },
  priority: { type: 'byte' },
  timeout: { type: 'long' },
  process_expiration: { type: 'date' },
  created_by: { type: 'keyword' },
  created_at: { type: 'date' },
  started_at: { type: 'date' },
  completed_at: { type: 'date' },
  attempts: { type: 'short' },
  max_attempts: { type: 'short' },
  status: { type: 'keyword' },
  output: {
    type: 'object',
    properties: {
      content_type: { type: 'keyword' },
      content: { type: 'object', enabled: false }
    }
  }
};

export function createIndex(client, indexName,
  doctype = constants.DEFAULT_SETTING_DOCTYPE,
  indexSettings = { }) {
  const body = {
    settings: {
      ...constants.DEFAULT_SETTING_INDEX_SETTINGS,
      ...indexSettings
    },
    mappings: {
      [doctype]: {
        properties: schema
      }
    }
  };

  return client.indices.exists({
    index: indexName,
  })
    .then((exists) => {
      if (!exists) {
        return client.indices.create({
          index: indexName,
          body: body
        })
          .then(() => true);
      }
      return exists;
    });
}
