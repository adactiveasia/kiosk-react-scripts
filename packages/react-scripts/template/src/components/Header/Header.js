// @flow

import * as React from 'react';
import type { Node } from 'react';

import { version, name } from '../../../package.json';

import './header.css';

type PropsType = {|
    logo: string
|};

export default ({ logo }: PropsType): Node => (
    <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">
            {`Welcome to ${name} version ${version}!`}
        </h1>
    </header>
);
