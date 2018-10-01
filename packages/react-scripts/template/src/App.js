// @flow

import * as React from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';

import {
    AdsumLoader, AdsumWebMap, ArrowPathPatternOptions, DotPathBuilder, DotPathBuilderOptions,
    PinUserObject, SingleFloorAnimation,
} from '@adactive/adsum-web-map';

import ACA from '@adactive/adsum-utils/services/ClientAPI';

import { Map, WayfindingActions } from '@adactive/arc-map';
import deviceConfig from './services/Config';
import store from './store/index';

import { Header } from './components/Header/index';

import './App.css';

import logo from './assets/logo.png';

type MappedStatePropsType = {|
    mapState: MapStateType
|};

type MappedDispatchPropsType = {|
    onMapClicked: (object) => void
|};
type OwnPropsType = {||};
type PropsType = MappedStatePropsType & MappedDispatchPropsType & OwnPropsType;


type StateType = {|
    mapLoaded: boolean,
    configLoaded: boolean,
|};

class App extends React.Component<PropsType, StateType> {
    state = {
        configLoaded: false,
        mapLoaded: false,
    };

    awmContainerRef = React.createRef();

    awm: ?AdsumWebMap = null;

    componentDidMount() {
        deviceConfig.init()
            .then((): void => ACA.init(deviceConfig.config.api))
            .then((): void => ACA.load())
            .then(() => {
                this.awm = new AdsumWebMap({
                    loader: new AdsumLoader({
                        entityManager: ACA.entityManager, // Give it in order to be used to consume REST API
                        deviceId: deviceConfig.config.map.deviceId, // The device Id to use
                        wireframeSpaces: true,
                        wireframeSpacesOptions: { color: 0x5a5b5a },
                    }), // The loader to use
                    camera: {
                        centerOnOptions: {
                            fitRatio: 3,
                            minDistance: 50,
                        },
                    },
                    engine: {
                        container: this.awmContainerRef.current, // The div DOMElement to insert the canvas into
                    },
                    wayfinding: {
                        pathBuilder: new DotPathBuilder(new DotPathBuilderOptions({
                            patternSpace: 2.5, // 4,
                            patternSize: 1, // 2
                            pattern: new ArrowPathPatternOptions({
                                color: '#be272f',
                            }),
                        })),
                        userObject: new PinUserObject({ color: '#be272f', size: 8 }),
                    },
                    scene: {
                        animation: new SingleFloorAnimation({
                            keepSiteVisible: false,
                            bounce: true,
                            center: true,
                            centerOnOptions: {
                                fitRatio: 1.15,
                                minDistance: 300,
                            },
                        }),
                    },
                });

                this.setState({ configLoaded: true });
            });
    }

    componentDidUpdate() {
        const { mapLoaded, configLoaded } = this.state;
        const { mapState } = this.props;
        if (configLoaded && !mapLoaded && mapState === 'idle') {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ mapLoaded: true });
        }
    }

    isMapOpen() { // eslint-disable-line class-methods-use-this
        // Depending on your project, feel free to change the behavior depending on your pathName prop value
        return true;
    }

    renderMap = (): Map => {
        const { onMapClicked } = this.props;

        return (
            <Map
                store={store}
                awm={this.awm}
                isOpen={this.isMapOpen()}
                className="app-map-container"
                onClick={onMapClicked}
                userObjectLabel={this.userObjectLabel}
            >
                <div id="adsum-web-map-container" ref={this.awmContainerRef} />
            </Map>
        );
    };

    renderLoadingScreen(): ?Element<'div'> {
        const { mapLoaded } = this.state;

        if (!mapLoaded) {
            return (
                <div className="loadingScreen">
                    <p>LOADING....</p>
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
                { this.renderMap() }
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
            dispatch(WayfindingActions.goToPlaceAction(object.placeId));
        }
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);
