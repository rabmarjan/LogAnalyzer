import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import throttle from '../middleware/throttle';
import rootReducer from '../rootReducer';

export default function configureStore(preloadedState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(throttle, thunk))
  );
}
