import { getUrlParams } from './urlParams';
import * as rest from '../services/rest';
import { STATUS } from '../constants';
import {
  getKey,
  createActionTypes,
  createAction,
  createReducer
} from './apiHelpers';

const actionTypes = createActionTypes('SPANS');
export const [SPANS_LOADING, SPANS_SUCCESS, SPANS_FAILURE] = actionTypes;

const INITIAL_STATE = { data: {} };
const spans = createReducer(actionTypes, INITIAL_STATE);
const spansCollection = (state = {}, action) => {
  if (!actionTypes.includes(action.type)) {
    return state;
  }

  return {
    ...state,
    [action.key]: spans(state[action.key], action),
    lastSuccess: action.type === SPANS_SUCCESS ? action.key : state.lastSuccess
  };
};

export const loadSpans = createAction(actionTypes, rest.loadSpans);

export function getSpansNext(state) {
  const { serviceName, start, end, transactionId } = getUrlParams(state);
  const key = getKey({ serviceName, start, end, transactionId });
  return state.spans[key] || INITIAL_STATE;
}

export function getSpans(state) {
  const next = getSpansNext(state);
  const key = state.spans.lastSuccess;
  const prev = state.spans[key] || INITIAL_STATE;
  return next.status === STATUS.SUCCESS ? next : prev;
}

export default spansCollection;
