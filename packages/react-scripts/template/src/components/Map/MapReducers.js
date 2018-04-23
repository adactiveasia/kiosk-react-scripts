import { types as mapActionsType } from './MapActions';
import mapController from "./MapController";

const mapReducers = (state, action) => {
    if (state === undefined) {
        state = {
            mode: "3D",
            current_place: null,
            current_floor: 0,
            current_floor_name: "",
            buildings: [],
            is_zoom_in_enable: "",
            is_zoom_out_enable: "",
            is_open: false,
            larger_div: false,
            force_update_controls: true,
            displayed_path: null,
            path_floors_list: [],
            path_direction: null,
            home_floor: {
                id: -1,
                name: ""
            }
        };
    }
    switch (action.type) {
        case mapActionsType.SWITCH_MODE:
            mapController.switchMode(action.mode);
            return {
                mode: action.mode
            };
        default:
            return state
    }
};

export default mapReducers