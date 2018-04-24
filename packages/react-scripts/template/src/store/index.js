import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../rootReducer';
import rootSaga from '../rootSaga';
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
    const store = createStoreWithMiddleware(rootReducer, preloadState);
    sagaMiddleware.run(rootSaga);
    return store
}

const store = configureStore();

export default store;
