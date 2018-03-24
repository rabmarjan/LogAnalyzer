import { handleActions } from 'redux-actions';

import { addLicense } from '../actions/add_license';

export const license = handleActions({
  [addLicense](state, { payload }) {
    return payload;
  }
}, {});

