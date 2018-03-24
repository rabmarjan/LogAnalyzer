import { getUrlParams } from './urlParams';
import * as rest from '../services/rest';
import { STATUS } from '../constants';

import {
  getKey,
  createActionTypes,
  createAction,
  createReducer
} from './apiHelpers';

const actionTypes = createActionTypes('TRANSACTION');
export const [
  TRANSACTION_LOADING,
  TRANSACTION_SUCCESS,
  TRANSACTION_FAILURE
] = actionTypes;

// REDUCER
const INITIAL_STATE = { data: {} };
const transaction = createReducer(actionTypes, INITIAL_STATE);

const transactions = (state = {}, action) => {
  if (!actionTypes.includes(action.type)) {
    return state;
  }

  return {
    ...state,
    [action.key]: transaction(state[action.key], action),
    lastSuccess:
      action.type === TRANSACTION_SUCCESS ? action.key : state.lastSuccess
  };
};

export const loadTransaction = createAction(actionTypes, rest.loadTransaction);

export function getTransactionNext(state) {
  const { serviceName, start, end, transactionId } = getUrlParams(state);
  const key = getKey({ serviceName, start, end, transactionId });
  return state.transactions[key] || INITIAL_STATE;
}

export function getTransaction(state) {
  const next = getTransactionNext(state);
  const key = state.transactions.lastSuccess;
  const prev = state.transactions[key] || INITIAL_STATE;
  return next.status === STATUS.SUCCESS ? next : prev;
}

export default transactions;
