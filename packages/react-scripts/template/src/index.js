import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { history } from './router';

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

ReactDOM.render(dom, root);

registerServiceWorker();
