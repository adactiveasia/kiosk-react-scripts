// @flow

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import map from '@adactive/arc-map/src/MapReducers';
import type { MapReducersType } from '@adactive/arc-map/src/MapReducers';

export type RoutingReducerType = {|
    location: {|
    pathname: string,
        search: string,
        hash: string
    |}
|};

export type AppStateType = {|
    routing: RoutingReducerType,
    map: MapReducersType
|};

const appState: AppState = {
  routing: routerReducer,
  map
};

export default combineReducers(appState);
