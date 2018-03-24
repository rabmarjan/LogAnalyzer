import moment from 'moment';
import querystring from 'querystring';
import { cryptoFactory } from '../../../server/lib/crypto';
import { getSavedObjectFactory } from './lib/get_saved_object';
import { oncePerServer } from '../../../server/lib/once_per_server';

function createJobFn(server) {
  const getSavedObject = getSavedObjectFactory(server);
  const crypto = cryptoFactory(server);

  return async function createJob({ objectType, savedObjectId, queryString, browserTimezone, layout }, headers, request) {
    const date = moment().toISOString();
    const query = querystring.parse(decodeURIComponent(queryString));

    const serializedEncryptedHeaders = await crypto.encrypt(headers);

    const savedObject = await getSavedObject(request, objectType, savedObjectId, query);

    return {
      id: savedObject.id,
      title: savedObject.title,
      description: savedObject.description,
      type: savedObject.type,
      // previously, we were saving an array of objects because the dashboard would return
      // an object per visualization/search, but now that we're using the dashboard to take screenshots
      // this is no longer required. However, I don't want to break previous versions of Kibana, so
      // we will continue to use the old schema
      objects: [ savedObject ],
      date,
      query,
      headers: serializedEncryptedHeaders,
      browserTimezone,
      layout
    };
  };
}

export const createJobFactory = oncePerServer(createJobFn);
