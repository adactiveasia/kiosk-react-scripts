import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { history } from './router';
import ACA from './services/ClientAPI';

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
ACA.entityManager.load().then(() => {
  	// Retrieve the data you need there
  	const pois = ACA.entityManager.getRepository('Poi').getAll();
  	console.log(pois)

  	ReactDOM.render(dom, root);

	registerServiceWorker();
});


