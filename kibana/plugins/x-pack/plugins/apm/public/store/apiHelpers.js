import { STATUS } from '../constants';
const hash = require('object-hash/index');

export function createActionTypes(actionName) {
  return [
    `${actionName}_LOADING`,
    `${actionName}_SUCCESS`,
    `${actionName}_FAILURE`
  ];
}

export function createReducer(actionTypes, initialState) {
  const [LOADING, SUCCESS, FAILURE] = actionTypes;

  return (state = initialState, action) => {
    switch (action.type) {
      case LOADING:
        return { ...initialState, args: action.args, status: STATUS.LOADING };

      case SUCCESS:
        return {
          args: action.args,
          data: action.response || initialState.data,
          status: STATUS.SUCCESS
        };

      case FAILURE:
        return {
          args: action.args,
          ...initialState,
          error: action.error,
          status: STATUS.FAILURE
        };
      default:
        return state;
    }
  };
}

export function createAction(actionTypes, callApi) {
  const [LOADING, SUCCESS, FAILURE] = actionTypes;

  return (args = {}) => {
    return async dispatch => {
      const key = hash(args);
      dispatch({ type: LOADING, key, args });

      let response;
      try {
        response = await callApi(args);
      } catch (error) {
        console.error(error);
        return dispatch({
          args,
          key,
          error,
          type: FAILURE
        });
      }

      try {
        return dispatch({
          args,
          key,
          response,
          type: SUCCESS
        });
      } catch (error) {
        console.error(error);
      }
    };
  };
}

export const getKey = (obj = {}) => hash(obj);
