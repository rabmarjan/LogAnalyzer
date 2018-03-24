import * as rest from '../services/rest';
import {
  getKey,
  createActionTypes,
  createAction,
  createReducer
} from './apiHelpers';

const actionTypes = createActionTypes('ERROR_DISTRIBUTION');
export const [
  ERROR_DISTRIBUTION_LOADING,
  ERROR_DISTRIBUTION_SUCCESS,
  ERROR_DISTRIBUTION_FAILURE
] = actionTypes;

const INITIAL_STATE = { data: { buckets: [], totalHits: 0 } };
const distribution = createReducer(actionTypes, INITIAL_STATE);

const errorDistributions = (state = {}, action) => {
  if (!actionTypes.includes(action.type)) {
    return state;
  }

  return {
    ...state,
    [action.key]: distribution(state[action.key], action)
  };
};

export const loadErrorDistribution = createAction(
  actionTypes,
  rest.loadErrorDistribution
);

export function getErrorDistribution(state) {
  const { serviceName, start, end, errorGroupId } = state.urlParams;
  const key = getKey({ serviceName, start, end, errorGroupId });
  return state.errorDistributions[key] || INITIAL_STATE;
}

export default errorDistributions;
