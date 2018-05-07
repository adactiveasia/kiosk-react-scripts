// @flow

export type MapZoomType = {|
  current: number,
  max: number,
  min: number
|};
export type MapModeType = '2D' | '3D';
export type MapStateType = 'initial' | 'idle' | 'transition' | 'pause';
export type MapReducerStateType = {|
  +state: MapStateType,
  +mode: MapModeType,
  +buildings: ?() => [number],
  +floors: ?() => [number],
  +zoom: MapZoomType,
  +currentFloor: ?number,
  +previousFloor: ?number,
  +currentPath: {

  },
  +currentClickedEvent: ?Object,
  +cameraMoved: boolean,
  +sortedPlaces: Array<Object>
|};

/**
 * Map actions types
 * @memberof! module:Map#
 * @name ActionsTypes
 * @alias ActionsTypes
 * @property {string} [state=initial|idle|transition|pause] - Current canvas state indicator
 * @property {string} [mode=3D|2D] - map display mode
 */
export const initialState: MapReducerStateType = {
    state: 'initial',
    mode: '3D',
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
