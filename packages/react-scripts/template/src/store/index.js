import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../rootReducer';
import { routerMiddleware } from '../router';

const sagaMiddleware = createSagaMiddleware();
const initialState = {};
const enhancers = [];
const middleware = [
  sagaMiddleware,
  routerMiddleware
];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const createStoreWithMiddleware = compose(
  applyMiddleware(...middleware),
  ...enhancers
)(createStore);


function configureStore(preloadState = initialState) {
  return createStoreWithMiddleware(rootReducer, preloadState);
}

const store = configureStore();

export default store;
