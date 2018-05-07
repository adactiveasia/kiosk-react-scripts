// @flow

import selectionController from './controllers/SelectionController';

import type { MapModeType } from './initialState';

/**
 * Map actions types
 * @memberof! module:Map#
 * @name ActionsTypes
 * @alias ActionsTypes
 * @property {constant} WILL_INIT will initialize the adsum web map
 * @property {constant} SWITCH_MODE switch between 2d/3d
 */
export const types = {
    WILL_INIT: 'map/WILL_INIT',
    DID_INIT: 'map/DID_INIT',
    SWITCH_MODE: 'map/SWITCH_MODE',
    FLOOR_WILL_CHANGE: 'map/FLOOR_WILL_CHANGE',
    FLOOR_DID_CHANGE: 'map/FLOOR_DID_CHANGE',
    ON_CLICK: 'map/ON_CLICK',
};

export type WillInitActionType = {| type: 'map/WILL_INIT' |};
export type SwitchModeActionType = {| type: 'map/SWITCH_MODE', mode: MapModeType |};
export type DidInitActionType = {| type: 'map/DID_INIT' |};
export type FloorWillChangeActionType = {|
    type: 'map/FLOOR_WILL_CHANGE',
    floorID: number
|};
export type FloorDidChangeActionType = {|
    type: 'map/FLOOR_DID_CHANGE',
    currentFloor: ?number,
    previousFloor: ?number
|};
export type OnClickActionType = {| type: 'map/ON_CLICK', currentClickedEvent: any |};
export type MapActionType =
  | WillInitActionType
  | DidInitActionType
  | SwitchModeActionType
  | FloorWillChangeActionType
  | FloorDidChangeActionType
  | OnClickActionType;

export type WillInitActionCreatorType = () => WillInitActionType;
export type SwitchModeActionCreatorType = () => SwitchModeActionType;
export type DidInitActionCreatorType = () => DidInitActionType;
export type FloorWillChangeActionCreatorType = (floorId: number) => FloorWillChangeActionType;
export type FloorDidChangeActionCreatorType = (currentFloor: ?number, previousFloor: ?number) => FloorDidChangeActionType;
export type OnClickActionCreatorType = (currentClickedEvent: any) => OnClickActionType;

/**
 * Init adsum web map
 * @function <i>mapActions</i> <strong>init</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const init: WillInitActionCreatorType = (): WillInitActionType => ({
    type: types.WILL_INIT
});

/**
 * Switching between 3D and 2D
 * @function <i>mapActions</i> <strong>switchMode</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
let mode: MapModeType = '3D';

export const switchMode: SwitchModeActionCreatorType = (): SwitchModeActionType => {
    mode = (mode === '3D') ? '2D' : '3D';
    return {
        type: types.SWITCH_MODE,
        mode
    };
};

/**
 * Finished map initialization
 * @function <i>mapActions</i> <strong>didInit</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const didInit: DidInitActionCreatorType = (): DidInitActionType => ({
    type: types.DID_INIT
});

/**
 * Change floor
 * @function <i>mapActions</i> <strong>changeFloor</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const changeFloor: FloorWillChangeActionCreatorType = (floorID: number): FloorWillChangeActionType => ({
    type: types.FLOOR_WILL_CHANGE,
    floorID
});

/**
 * floor did change
 * @function <i>mapActions</i> <strong>floorDidChanged</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const floorDidChanged: FloorDidChangeActionCreatorType = (currentFloor: ?number, previousFloor: ?number): FloorDidChangeActionType => ({
    type: types.FLOOR_DID_CHANGE,
    currentFloor,
    previousFloor,
});

/**
 * Trigger on click on the map
 * @function <i>mapActions</i> <strong>onClick</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const onClick: OnClickActionCreatorType = (getEventMethod: any): OnClickActionType => {
    selectionController.onClick();

    return {
        type: types.ON_CLICK,
        currentClickedEvent: getEventMethod
    };
};
