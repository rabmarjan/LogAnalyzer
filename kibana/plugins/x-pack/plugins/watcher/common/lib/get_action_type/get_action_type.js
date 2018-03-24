import { keys, values, intersection } from 'lodash';
import { ACTION_TYPES } from '../../constants';

export function getActionType(action) {
  const type = intersection(
    keys(action),
    values(ACTION_TYPES)
  )[0] || ACTION_TYPES.UNKNOWN;

  return type;
}
