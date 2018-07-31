// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import ACA from '@adactive/adsum-utils/services/ClientAPI';

import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { history } from './router';
import deviceConfig from './services/Config';

import appService from './services/AppService';

import App from './App';

import './index.css';

const root = document.getElementById('root');
const dom = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <App />
            </div>
        </ConnectedRouter>
    </Provider>
);

if (root) {
    // Load the data
    deviceConfig.init()
        .then((): void => ACA.init(deviceConfig.config, deviceConfig.fallbackOnlineApi))
        .then((): void => ACA.entityManager.load())
        .then((): void => appService.preloadAppImages())
        .then(() => {
            ReactDOM.render(dom, root);

            registerServiceWorker();
        });
}
