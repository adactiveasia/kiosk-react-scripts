// @flow

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import map from './components/Map/MapReducers';
import type { MapReducers } from './components/Map/MapReducers';


export type AppState = {|
  routing: Object,
  map: MapReducers
|};

const appState: AppState = {
  routing: routerReducer,
  map
};

export default combineReducers(appState);
