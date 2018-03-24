import { get, contains, values } from 'lodash';
import { WATCH_TYPES } from '../../../../../common/constants';

export function getWatchType(watchJson) {
  const type = get(watchJson, 'metadata.xpack.type');
  if (contains(values(WATCH_TYPES), type)) {
    return type;
  }

  return WATCH_TYPES.JSON;
}
