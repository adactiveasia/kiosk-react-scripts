// @flow

import { types as mapActionsType } from './MapActions';
import { initialState } from "./initialState";

import type { MapReducerState } from './initialState';
import type { MapAction } from "./MapActions";

export type MapReducers = (state: MapReducerState, action: MapAction) => MapReducerState;

const mapReducers: MapReducers = (state: MapReducerState = initialState, action: MapAction): MapReducerState => {
    switch (action.type) {
    case mapActionsType.DID_INIT: {
        const { floors, buildings, currentFloor } = action;

        return {
            ...state,
            state: "idle",
            floors,
            buildings,
            currentFloor,
        };
    }
    case mapActionsType.FLOOR_WILL_CHANGE:
        return {
            ...state,
            state: "transition",
        };
    case mapActionsType.FLOOR_DID_CHANGE: {
        const { currentFloor, previousFloor } = action;

        return {
            ...state,
            state: "idle",
            currentFloor,
            previousFloor,
        };
    }
    case mapActionsType.ON_CLICK: {
        const { currentClickedEvent } = action;

        return {
            ...state,
            currentClickedEvent
        };
    }
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
