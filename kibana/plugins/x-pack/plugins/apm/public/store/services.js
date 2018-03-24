import _ from 'lodash';
import * as rest from '../services/rest';
import {
  getKey,
  createActionTypes,
  createAction,
  createReducer
} from './apiHelpers';

const actionTypes = createActionTypes('APP');
export const [SERVICE_LOADING, SERVICE_SUCCESS, SERVICE_FAILURE] = actionTypes;

const INITIAL_STATE = {
  data: {
    types: []
  }
};

const service = createReducer(actionTypes, INITIAL_STATE);
const services = (state = {}, action) => {
  if (!actionTypes.includes(action.type)) {
    return state;
  }

  return {
    ...state,
    [action.key]: service(state[action.key], action)
  };
};

export const loadApp = createAction(actionTypes, rest.loadApp);

export function getService(state) {
  const { serviceName, start, end } = state.urlParams;
  const key = getKey({ serviceName, start, end });
  return state.services[key] || INITIAL_STATE;
}

export function getDefaultTransactionType(state) {
  const types = getService(state).data.types;
  return _.first(types);
}

export default services;
