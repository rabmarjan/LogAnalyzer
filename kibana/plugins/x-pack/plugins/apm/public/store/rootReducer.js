import { combineReducers } from 'redux';

import serviceLists from './serviceLists';
import services from './services';
import charts from './charts';
import errorDistributions from './errorDistributions';
import errorGroupLists from './errorGroupLists';
import errorGroups from './errorGroups';
import license from './license';
import location from './location';
import sorting from './sorting';
import spans from './spans';
import transactionDistributions from './transactionDistributions';
import transactionLists from './transactionLists';
import transactions from './transactions';
import urlParams from './urlParams';

const appReducer = combineReducers({
  serviceLists,
  services,
  charts,
  errorDistributions,
  errorGroupLists,
  errorGroups,
  license,
  location,
  sorting,
  spans,
  transactionDistributions,
  transactionLists,
  transactions,
  urlParams
});

// This adds support for clearing the redux store, eg. via an interval, to avoid stale data.
const rootReducer = (state, action) => {
  let newState = { ...state };
  if (action.type === 'RESET_STATE') {
    newState = {
      ...state,
      errorGroupLists: undefined,
      errorGroups: undefined,
      transactionLists: undefined,
      service: undefined,
      services: undefined
    };
  }

  return appReducer(newState, action);
};

export default rootReducer;
