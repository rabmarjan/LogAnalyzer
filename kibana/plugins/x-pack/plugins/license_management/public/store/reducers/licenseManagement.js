import { combineReducers } from 'redux';
import { license } from './license';
import { uploadStatus } from './upload_status';
import { uploadErrorMessage } from "./upload_error_message";
import moment from 'moment-timezone';

export const WARNING_THRESHOLD_IN_DAYS = 25;

export const licenseManagement = combineReducers({
  license,
  uploadStatus,
  uploadErrorMessage,
});

export const getLicense = (state) => {
  return state.license;
};

export const getExpirationMillis = (state) => {
  return getLicense(state).expiryDateInMillis;
};

export const getExpirationDate = (state) => {
  return moment.tz(getExpirationMillis(state), moment.tz.guess());
};

export const getExpirationDateFormatted = (state) => {
  return getExpirationDate(state).format('LLL z');
};

export const isExpired = (state) => {
  return new Date().getTime() > getExpirationMillis(state);
};

export const getLicenseType = (state) => {
  return getLicense(state).type;
};

export const isImminentExpiration = (state) => {
  const now = new Date();
  const expirationDate = getExpirationDate(state);
  return expirationDate.isAfter(now) && expirationDate.diff(now, 'days') <= WARNING_THRESHOLD_IN_DAYS;
};

export const couldUpgrade = (state) => {
  const { type } = getLicense(state);
  return type === 'basic' || type === 'trial' || isExpired(state);
};

export const showBasicRegistration = (state) => {
  const { type } = getLicense(state);
  return type === 'trial' || isImminentExpiration(state) || isExpired(state);
};

export const needsAcknowledgement = (state) => {
  return !!state.uploadStatus.acknowledge;
};

export const isApplying = (state) => {
  return !!state.uploadStatus.applying;
};

export const uploadMessages = (state) => {
  return state.uploadStatus.messages;
};

export const isInvalid = (state) => {
  return !!state.uploadStatus.invalid;
};

export const getUploadErrorMessage = (state) => {
  return state.uploadErrorMessage;
};

