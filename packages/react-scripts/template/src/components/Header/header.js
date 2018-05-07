// @flow

import * as React from 'react';
import type { Node } from 'react';

import './header.css';

type PropsType = {|
    logo: string
|};

export default (props: PropsType): Node => (
    <header className="App-header">
        <img src={props.logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
    </header>
);
