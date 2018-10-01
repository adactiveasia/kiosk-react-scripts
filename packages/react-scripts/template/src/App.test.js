import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import App from './App';
import store from './store';
import history from './router/history';

it('renders without crashing', () => {
    const root = document.createElement('div');
    const dom = (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App store={store} />
            </ConnectedRouter>
        </Provider>
    );
    ReactDOM.render(dom, root);
    ReactDOM.unmountComponentAtNode(root);
});
