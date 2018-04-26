// @flow

export type MapZoom = {|
  current: number,
  max: number,
  min: number
|};
export type MapMode = '2D' | '3D';
export type MapState = 'initial' | 'idle';
export type MapReducerState = {|
  +state: MapState,
  +mode: MapMode,
  +buildings: Array<number>,
  +floors: Array<number>,
  +zoom: MapZoom,
  +currentFloor: ?number,
  +currentPath: {

  },
  +currentClickedObject: ?Object,
  +currentSelection: Array<Object>,
  +cameraMoved: boolean,
  +sortedPlaces: Array<Object>,
|};

/**
 * Map actions types
 * @memberof! module:Map#
 * @name ActionsTypes
 * @alias ActionsTypes
 * @property {string} [state=initial|idle|transition|pause] - Current canvas state indicator
 * @property {string} [mode=3D|2D] - map display mode
 */
export const initialState: MapReducerState = {
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
  sortedPlaces: []
};
