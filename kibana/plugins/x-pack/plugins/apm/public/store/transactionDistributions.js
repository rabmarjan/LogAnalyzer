import * as rest from '../services/rest';
import {
  getKey,
  createActionTypes,
  createAction,
  createReducer
} from './apiHelpers';

const actionTypes = createActionTypes('TRANSACTION_DISTRIBUTION');
export const [
  TRANSACTION_DISTRIBUTION_LOADING,
  TRANSACTION_DISTRIBUTION_SUCCESS,
  TRANSACTION_DISTRIBUTION_FAILURE
] = actionTypes;

const INITIAL_STATE = { data: { buckets: [], totalHits: 0 } };
const distribution = createReducer(actionTypes, INITIAL_STATE);

const transactionDistributions = (state = {}, action) => {
  if (!actionTypes.includes(action.type)) {
    return state;
  }

  return {
    ...state,
    [action.key]: distribution(state[action.key], action)
  };
};

export const loadTransactionDistribution = createAction(
  actionTypes,
  rest.loadTransactionDistribution
);

export function getTransactionDistribution(state) {
  const { serviceName, start, end, transactionName } = state.urlParams;
  const key = getKey({ serviceName, start, end, transactionName });
  return state.transactionDistributions[key] || INITIAL_STATE;
}

export function getDefaultTransactionId(state) {
  const _distribution = getTransactionDistribution(state);
  return _distribution.data.defaultTransactionId;
}

export default transactionDistributions;
