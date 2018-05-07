// @flow

import * as React from 'react';
import { Route, Link } from 'react-router-dom';

import { Header } from './components/Header';
import { Home } from './routeComponents/Home';
import { About } from './routeComponents/About';

import logo from './logo.svg';
import './App.css';

type PropsType = {||};

class App extends React.Component<PropsType> {
    render() {
        return (
            <div className="App">
                <Header logo={logo} />
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/about-us">About</Link>
                </nav>
                <main>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about-us" component={About} />
                </main>
            </div>
        );
    }
}

export default App;
