import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../rootReducer';

export default function configureStore(preloadedState) {
  return createStore(rootReducer, preloadedState, applyMiddleware(thunk));
}
