import orderBy from 'lodash.orderby';
import { createSelector } from 'reselect';
import { getUrlParams } from './urlParams';
import * as rest from '../services/rest';
import {
  getKey,
  createActionTypes,
  createAction,
  createReducer
} from './apiHelpers';

const actionTypes = createActionTypes('TRANSACTIONS_LIST');
export const [
  TRANSACTIONS_LIST_LOADING,
  TRANSACTIONS_LIST_SUCCESS,
  TRANSACTIONS_LIST_FAILURE
] = actionTypes;

const INITIAL_STATE = { data: [] };
const list = createReducer(actionTypes, INITIAL_STATE);
const transactionLists = (state = {}, action) => {
  if (!actionTypes.includes(action.type)) {
    return state;
  }

  return {
    ...state,
    [action.key]: list(state[action.key], action)
  };
};

export const loadTransactionList = createAction(
  actionTypes,
  rest.loadTransactionList
);

export const getTransactionList = createSelector(
  state => state.transactionLists,
  state => state.sorting.transaction,
  getUrlParams,
  (transactionLists, transactionSorting, urlParams) => {
    const { serviceName, start, end, transactionType } = urlParams;
    const key = getKey({ serviceName, start, end, transactionType });

    if (!transactionLists[key]) {
      return INITIAL_STATE;
    }

    const { key: sortKey, descending } = transactionSorting;

    return {
      ...transactionLists[key],
      data: orderBy(
        transactionLists[key].data,
        sortKey,
        descending ? 'desc' : 'asc'
      )
    };
  }
);

export default transactionLists;
