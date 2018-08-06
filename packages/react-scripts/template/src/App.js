// @flow

import * as React from 'react';
import type { Element, } from 'react';
import { connect } from 'react-redux';

import { Map, mapActions } from '@adactive/arc-map';
import type { MapStateType } from '@adactive/arc-map/src/initialState';
import { ClientAPI as ACA } from '@adactive/adsum-utils';

import deviceConfig from './services/Config';
import store from './store/index';

import { Header } from './components/Header';
import logo from './logo.svg';
import './App.css';
import appService from './services/AppService';

import PopOver from './utils/popOver/PopOver';

type MappedStatePropsType = {|
    pathName: string,
    mapState: MapStateType
|};

type MappedDispatchPropsType = {|
    onMapClicked: (object) => void
|};
type OwnPropsType = {||};
type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;


type StateType = {||};

class App extends React.Component<PropsType, StateType> {
    state = {
        configLoaded: false,
        mapLoaded: false,
    };

    componentWillMount() {

    }

    componentDidMount() {
        // Load the data
        deviceConfig.init()
            .then((): void => ACA.init(deviceConfig.config.api))
            .then((): void => ACA.load())
            .then((): void => appService.preloadAppImages())
            .then(() => {
                this.setState({ configLoaded: true });
            });
    }

    componentDidUpdate() {
        if (!this.state.mapLoaded && this.props.mapState === 'idle') {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                mapLoaded: true
            });
        }
    }

    renderMain(): ?Element<'main'> {
        const { pathName } = this.props;

        if (!this.state.configLoaded) {
            return null;
        }

        return (
            <main>
                <Map
                    exact
                    path="/"
                    store={store}
                    device={deviceConfig.config.map.deviceId}
                    isOpen={
                        (pathName === '/')
                    }
                    onClick={this.props.onMapClicked}
                    display="3D"
                    backgroundImage="assets/textures/background.png"
                    PopOver={PopOver}
                >
                    {/* Children */}
                </Map>
            </main>
        );
    }

    renderLoadingScreen(): ?Element<'div'> {
        if (!this.state.mapLoaded) {
            return (
                <div className="loadingScreen">
                    LOADING...
                </div>
            );
        }

        return null;
    }

    render(): Element<'div'> {
        return (
            <div className="App">
                { this.renderLoadingScreen() }
                <Header logo={logo} />
                { this.renderMain() }
            </div>
        );
    }
}

const mapStateToProps = (state: AppStateType): MappedStatePropsType => ({
    pathName: state.routing.location.pathname,
    mapState: state.map.state,
});

const mapDispatchToProps = (dispatch: *): MappedDispatchPropsType => ({
    onMapClicked: (object): void => {
        if (object && object.placeId) {
            dispatch(mapActions.goToPlace(object.placeId));
        }
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
