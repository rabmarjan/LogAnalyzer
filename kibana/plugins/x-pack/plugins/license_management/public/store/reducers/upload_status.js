import { handleActions } from 'redux-actions';

import { uploadLicenseStatus } from '../actions/upload_license';

export const uploadStatus = handleActions({
  [uploadLicenseStatus](state, { payload }) {
    return payload;
  }
}, {});


