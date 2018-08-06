// @flow

import { createStore, applyMiddleware, compose } from 'redux';
import type { Middleware } from 'redux';

import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../rootReducer';
import rootSaga from '../rootSaga';
import { routerMiddleware } from '../router';

const sagaMiddleware = createSagaMiddleware();
const initialState = {};
const enhancers = [];
const middleware: Array<Middleware> = [
    thunk,
    routerMiddleware,
    sagaMiddleware
];

if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension());
    }
}

const createStoreWithMiddleware = compose(
    applyMiddleware(...middleware),
    ...enhancers
)(createStore);


function configureStore(preloadState = initialState) {
    const store = createStoreWithMiddleware(rootReducer, preloadState);
    store.runSaga = sagaMiddleware.run(rootSaga);
    return store;
}

const store = configureStore();

export default store;
