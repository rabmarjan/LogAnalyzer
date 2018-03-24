import * as rest from '../services/rest';
import orderBy from 'lodash.orderby';
import { getUrlParams } from './urlParams';
import { createSelector } from 'reselect';
import {
  getKey,
  createActionTypes,
  createAction,
  createReducer
} from './apiHelpers';

const actionTypes = createActionTypes('SERVICE_LIST');
export const [
  SERVICE_LIST_LOADING,
  SERVICE_LIST_SUCCESS,
  SERVICE_LIST_FAILURE
] = actionTypes;

const INITIAL_STATE = {
  data: []
};
const list = createReducer(actionTypes, INITIAL_STATE);
const serviceLists = (state = {}, action) => {
  if (!actionTypes.includes(action.type)) {
    return state;
  }

  return {
    ...state,
    [action.key]: list(state[action.key], action)
  };
};

export const loadServiceList = createAction(actionTypes, rest.loadServiceList);

// SELECTORS
export const getServiceList = createSelector(
  state => state.serviceLists,
  state => state.sorting.service,
  getUrlParams,
  (serviceLists, serviceSorting, urlParams) => {
    const { start, end } = urlParams;
    const key = getKey({ start, end });

    if (!serviceLists[key]) {
      return INITIAL_STATE;
    }

    const { key: sortKey, descending } = serviceSorting;

    return {
      ...serviceLists[key],
      data: orderBy(
        serviceLists[key].data,
        sortKey,
        descending ? 'desc' : 'asc'
      )
    };
  }
);

export default serviceLists;
