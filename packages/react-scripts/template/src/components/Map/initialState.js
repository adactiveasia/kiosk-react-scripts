// @flow

export type MapZoom = {|
  current: number,
  max: number,
  min: number
|};
export type MapMode = '2D' | '3D';
export type MapState = 'initial' | 'idle' | 'transition' | 'pause';
export type MapReducerState = {|
  +state: MapState,
  +mode: MapMode,
  +buildings: any,
  +floors: any,
  +zoom: MapZoom,
  +currentFloor: ?number,
  +previousFloor: ?number,
  +currentPath: {

  },
  +currentClickedEvent: ?Object,
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
  buildings: null,
  floors: null,
  zoom: {
    current: 0,
    max: 0,
    min: 0,
  },
  currentFloor: null,
  previousFloor: null,
  currentPath: {

  },
  currentClickedEvent: null,
  cameraMoved: false,
  sortedPlaces: []
};
