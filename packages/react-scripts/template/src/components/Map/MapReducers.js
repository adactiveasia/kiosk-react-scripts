import { types as mapActionsType } from './MapActions';
import { initialState } from "./initialState";

const mapReducers = (state = initialState , action) => {
    switch (action.type) {
        case mapActionsType.DID_INIT:
            const { floors, buildings } = action;
            return {
                ...state,
                state: "idle",
                floors,
                buildings,
            };
        case mapActionsType.SWITCH_MODE:
            return {
                mode: action.mode
            };
        case mapActionsType.WILL_INIT:
        default:
            return state
    }
};

export default mapReducers