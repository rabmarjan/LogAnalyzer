import { createSelector } from 'reselect';
import { getUrlParams } from './urlParams';
import * as rest from '../services/rest';
import { createActionTypes, createAction, createReducer } from './apiHelpers';

const actionTypes = createActionTypes('ERROR_GROUP_LIST');
export const [
  ERROR_GROUP_LIST_LOADING,
  ERROR_GROUP_LIST_SUCCESS,
  ERROR_GROUP_LIST_FAILURE
] = actionTypes;

const INITIAL_STATE = { data: [] };
const list = createReducer(actionTypes, INITIAL_STATE);
const errorGroupLists = (state = {}, action) => {
  if (!actionTypes.includes(action.type)) {
    return state;
  }

  return {
    ...state,
    [action.key]: list(state[action.key], action)
  };
};

export const loadErrorGroupList = createAction(
  actionTypes,
  rest.loadErrorGroupList
);

export const getErrorGroupListArgs = createSelector(
  getUrlParams,
  ({
    serviceName,
    start,
    end,
    q,
    sortBy = 'latestOccurrenceAt',
    sortOrder = 'desc'
  }) => {
    return { serviceName, start, end, q, sortBy, sortOrder };
  }
);

export const getErrorGroupList = (state, key) => {
  if (!state.errorGroupLists[key]) {
    return INITIAL_STATE;
  }

  return state.errorGroupLists[key];
};

export default errorGroupLists;
