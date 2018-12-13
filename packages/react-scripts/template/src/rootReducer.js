// @flow

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import map from '@adactive/arc-map/src/MapReducers';
import type { MapReducerStateType } from '@adactive/arc-map/src/initialState';

import loadingScreen from '@adactive/arc-loading-screen/src/LoadingScreenReducer';
import type { LoadingScreenReducerType } from '@adactive/arc-loading-screen/src/LoadingScreenReducer';

export type RoutingReducerType = {|
    location: {|
        pathname: string,
        search: string,
        hash: string,
    |}
|};

export type AppStateType = {|
    routing: RoutingReducerType,
    map: MapReducerStateType,
    loadingScreen: LoadingScreenReducerType,
|};

const appState: AppStateType = {
    routing: routerReducer,
    map,
    loadingScreen,
};

export default combineReducers(appState);
