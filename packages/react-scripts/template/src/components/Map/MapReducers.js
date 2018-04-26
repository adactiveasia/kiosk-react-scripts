// @flow

import { types as mapActionsType } from './MapActions';
import { initialState } from "./initialState";

import type { MapReducerState } from './initialState';
import type { MapAction } from "./MapActions";

export type MapReducers = (state: MapReducerState, action: MapAction) => MapReducerState;

const mapReducers: MapReducers = (state: MapReducerState = initialState , action: MapAction): MapReducerState => {
  switch (action.type) {
    case mapActionsType.DID_INIT:
      return {
        ...state,
        state: "idle",
      };
    case mapActionsType.SWITCH_MODE:
      return {
        ...state,
        mode: action.mode
      };
    case mapActionsType.WILL_INIT:
    default:
      return state
  }
};

export default mapReducers;
