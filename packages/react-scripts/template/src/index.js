import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { history } from './router';
import ACA from './services/ClientAPI';
//import FirebaseService from './services/FirebaseService';

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

// Load the data
ACA.entityManager.loadFromCache(true).then(() => {

  	ReactDOM.render(dom, root);

	registerServiceWorker();
});


