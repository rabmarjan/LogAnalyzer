import * as rest from '../services/rest';
import {
  getKey,
  createActionTypes,
  createAction,
  createReducer
} from './apiHelpers';

const actionTypes = createActionTypes('ERROR_GROUP');
export const [
  ERROR_GROUP_LOADING,
  ERROR_GROUP_SUCCESS,
  ERROR_GROUP_FAILURE
] = actionTypes;

const INITIAL_STATE = {
  data: {}
};

const errorGroup = createReducer(actionTypes, INITIAL_STATE);
const errorGroups = (state = {}, action) => {
  if (!actionTypes.includes(action.type)) {
    return state;
  }

  return {
    ...state,
    [action.key]: errorGroup(state[action.key], action)
  };
};

export const loadErrorGroup = createAction(actionTypes, rest.loadErrorGroup);

export function getErrorGroup(state) {
  const { serviceName, errorGroupId, start, end } = state.urlParams;
  const key = getKey({ serviceName, errorGroupId, start, end });
  return state.errorGroups[key] || INITIAL_STATE;
}

export default errorGroups;
