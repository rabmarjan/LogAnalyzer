import url from 'url';
import {
  getUnhashableStatesProvider,
  unhashUrl,
} from 'ui/state_management/state_hashing';
import moment from 'moment-timezone';
import { getLayout } from './layouts';

export function JobParamsProvider(Private, config) {
  const getUnhashableStates = Private(getUnhashableStatesProvider);

  const appTypes = {
    discover: {
      getParams: (path) => path.match(/\/discover\/(.+)/),
      objectType: 'search',
    },
    visualize: {
      getParams: (path) => path.match(/\/visualize\/edit\/(.+)/),
      objectType: 'visualization',
    },
    dashboard: {
      getParams: (path) => path.match(/\/dashboard\/(.+)/),
      objectType: 'dashboard'
    },
  };

  function parseFromUrl(urlWithHashes) {
    // We need to convert the hashed states in the URL back into their original RISON values,
    // because this URL will be sent to the API.
    const urlWithStates = unhashUrl(urlWithHashes, getUnhashableStates());
    const appUrlWithStates = urlWithStates.split('#')[1];

    const { pathname, query } = url.parse(appUrlWithStates, false);
    const pathParams = pathname.match(/\/([a-z]+)?(\/?.*)/);

    const appTypeKey = pathParams[1];
    const appType = appTypes[appTypeKey];

    // if the doc type is unknown, return an empty object, causing other checks to be falsy
    if (!appType) {
      throw new Error(`Unknown docType of ${appType}`);
    }

    const params = appType.getParams(pathname);
    if (params.length < 2) {
      throw new Error('Unable to parseUrl to determine object name');
    }

    const objectId = params[1];
    const browserTimezone = config.get('dateFormat:tz') === 'Browser' ? moment.tz.guess() : config.get('dateFormat:tz');


    return {
      savedObjectId: objectId,
      objectType: appType.objectType,
      queryString: query,
      browserTimezone: browserTimezone
    };
  }

  return function jobParams(controller, options) {
    const layout = getLayout(options.layoutId);

    return {
      ...parseFromUrl(window.location.href),
      layout: layout.getJobParams(),
    };
  };
}
