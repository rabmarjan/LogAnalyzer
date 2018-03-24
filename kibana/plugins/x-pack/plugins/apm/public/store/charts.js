import * as rest from '../services/rest';
import {
  getKey,
  createActionTypes,
  createAction,
  createReducer
} from './apiHelpers';

const actionTypes = createActionTypes('CHARTS');
export const [CHARTS_LOADING, CHARTS_SUCCESS, CHARTS_FAILURE] = actionTypes;

const INITIAL_STATE = {
  data: {
    totalHits: 0,
    dates: [],
    responseTimes: {},
    tpmBuckets: [],
    weightedAverage: null
  }
};

const chartCollection = createReducer(actionTypes, INITIAL_STATE);
const charts = (state = {}, action) => {
  if (!actionTypes.includes(action.type)) {
    return state;
  }

  return {
    ...state,
    [action.key]: chartCollection(state[action.key], action)
  };
};

export const loadCharts = createAction(actionTypes, rest.loadCharts);

export function getCharts(state, keyArgs) {
  const key = getKey(keyArgs);
  return state.charts[key] || INITIAL_STATE;
}

export default charts;
