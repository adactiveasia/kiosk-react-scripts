// @flow

import * as React from 'react';
import type { Element, } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Header } from './components/Header';

import { Map, mapActions } from '@adactive/arc-map';
import deviceConfig from './services/Config';
import store from './store/index';

import logo from './logo.svg';
import './App.css';

type MappedStatePropsType = {|
    pathName: string
|};

type MappedDispatchPropsType = {||};
type OwnPropsType = {||};
type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;


type StateType = {||};

class App extends React.Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
    }

    state = {
    };

    orientation = (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';

    componentWillMount() {

    }

    componentDidMount() {

    }

    onMapClicked(object) {
        if (object && object.placeId) {
            // DO STUFF
        }
    }

    render(): Element<'div'> {
        const {
            pathName
        } = this.props;

        return (
            <div className="App">
                <Header logo={logo} />
                <main>
                    <Map
                        exact
                        path="/"
                        store={store}
                        device={deviceConfig.config.device}
                        isOpen={
                            (pathName === '/')
                        }
                        onClick={object => this.onMapClicked(object)}
                        display="3D"
                        backgroundImage="assets/textures/background.png"
                    >
                        {/* Children */}
                    </Map>
                </main>
            </div>
        );
    }
}

const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
    pathName: state.routing.location.pathname,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
