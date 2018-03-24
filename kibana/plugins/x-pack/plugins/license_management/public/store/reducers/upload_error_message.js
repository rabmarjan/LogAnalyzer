import { handleActions } from 'redux-actions';

import { addUploadErrorMessage } from '../actions/add_error_message';

export const uploadErrorMessage = handleActions({
  [addUploadErrorMessage](state, { payload }) {
    return payload;
  }
}, '');
