import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { licenseManagement } from './reducers/';

export const licenseManagementStore = (initialState = {}, services = {}) => {
  const enhancers = [ applyMiddleware(thunk.withExtraArgument(services)) ];

  window.__REDUX_DEVTOOLS_EXTENSION__ && enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  return createStore(
    licenseManagement,
    initialState,
    compose(...enhancers)
  );
};


