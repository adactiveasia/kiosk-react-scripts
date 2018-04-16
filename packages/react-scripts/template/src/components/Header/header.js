import * as React from 'react';
import './header.css';

type Props = {
  logo: string
};

export default (props: Props) => (
  <header className="App-header">
    <img src={props.logo} className="App-logo" alt="logo" />
    <h1 className="App-title">Welcome to React</h1>
  </header>
);
