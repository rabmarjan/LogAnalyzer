import { get, pick } from 'lodash';
import { parseKibanaState } from '../../../../../../server/lib/parse_kibana_state';
import { uriEncode } from './uri_encode';
import { getAbsoluteTime } from './get_absolute_time';
import { oncePerServer } from '../../../../server/lib/once_per_server';

function getSavedObjectFn() {

  const appHashes = {
    dashboard: {
      get: function (id) {
        return '/dashboard/' + uriEncode.string(id, true);
      },
    },
    visualization: {
      get: function (id) {
        return '/visualize/edit/' + uriEncode.string(id, true);
      },
    },
    search: {
      get: function (id) {
        return '/discover/' + uriEncode.string(id, true);
      },
    }
  };

  function getUrlHash(type, id, query) {
    const appHash = appHashes[type];
    if (!appHash) throw new Error('Unexpected app type: ' + type);

    // modify the global state in the query
    const globalState = parseKibanaState(query, 'global');
    if (globalState.exists) {
      globalState.removeProps('refreshInterval');

      // transform to absolute time
      globalState.set('time', getAbsoluteTime(globalState.get('time')));

      Object.assign(query, globalState.toQuery());
    }

    const hash = appHash.get(id);

    // Kibana appends querystrings to the hash, and parses them as such,
    // so we'll do the same internally so kibana understands what we want
    const unencodedQueryString = uriEncode.stringify(query);

    return `${hash}?${unencodedQueryString}`;
  }

  function validateType(type) {
    const app = appHashes[type];
    if (!app) throw new Error('Invalid object type: ' + type);
  }

  return async function getSavedObject(request, type, id, query) {
    const fields = ['title', 'description'];
    validateType(type);

    function parseJsonObjects(source) {
      const searchSourceJson = get(source, 'kibanaSavedObjectMeta.searchSourceJSON', '{}');
      const uiStateJson = get(source, 'uiStateJSON', '{}');
      let searchSource;
      let uiState;

      try {
        searchSource = JSON.parse(searchSourceJson);
      } catch (e) {
        searchSource = {};
      }

      try {
        uiState = JSON.parse(uiStateJson);
      } catch (e) {
        uiState = {};
      }

      return { searchSource, uiState };
    }

    const savedObjectsClient = request.getSavedObjectsClient();

    let attributes;
    try {
      const savedObject = await savedObjectsClient.get(type, id);
      attributes = savedObject.attributes;
    } catch (err) {
      return {
        id,
        type,
        isMissing: true
      };
    }

    const { searchSource, uiState } = parseJsonObjects(attributes);

    return Object.assign(pick(attributes, fields), {
      id,
      type,
      searchSource,
      uiState,
      urlHash: getUrlHash(type, id, query),
    });
  };
}

export const getSavedObjectFactory = oncePerServer(getSavedObjectFn);
