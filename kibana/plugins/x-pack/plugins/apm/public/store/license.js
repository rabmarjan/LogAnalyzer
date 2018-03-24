import * as rest from '../services/rest';
import { createActionTypes, createAction, createReducer } from './apiHelpers';

const actionTypes = createActionTypes('LICENSE');
export const [LICENSE_LOADING, LICENSE_SUCCESS, LICENSE_FAILURE] = actionTypes;

const INITIAL_STATE = {};
const license = createReducer(actionTypes, INITIAL_STATE);
export const loadLicense = createAction(actionTypes, rest.loadLicense);

export default license;
