/**
 * Map actions types
 * @memberof! module:Map#
 * @name ActionsTypes
 * @alias ActionsTypes
 * @property {string} [state=initial|idle|transition|pause] - Current canvas state indicator
 * @property {string} [mode=3D|2D] - map display mode
 */
export const initialState = {
    state: "initial",
    mode: "3D",
    buildings: [],
    floors: [],
    zoom: {
        current: 0,
        max: 0,
        min: 0,
    },
    currentFloor: null,
    currentPath: {

    },
    currentClickedObject: null,
    currentSelection: [],
    cameraMoved: false,
    sortedPlaces: [],
};
