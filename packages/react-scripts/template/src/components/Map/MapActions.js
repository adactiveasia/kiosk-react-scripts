// @flow

import type { MapMode } from "./initialState";

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
};

export type WillInitAction = {| type: 'map/WILL_INIT' |};
export type SwitchModeAction = {| type: 'map/SWITCH_MODE', mode: '2D' | '3D' |};
export type DidInitAction = {| type: 'map/DID_INIT' |};
export type MapAction =
  | WillInitAction
  | DidInitAction
  | SwitchModeAction;

export type WillInitActionCreator = () => WillInitAction;
export type SwitchModeActionCreator = () => SwitchModeAction;
export type DidInitActionCreator = () => DidInitAction;

/**
 * Init adsum web map
 * @function <i>mapActions</i> <strong>init</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const init: WillInitActionCreator = () => ({
  type: types.WILL_INIT
});

/**
 * Switching between 3D and 2D
 * @function <i>mapActions</i> <strong>switchMode</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
let mode: MapMode = '3D';

export const switchMode: SwitchModeActionCreator = () => {
  mode = (mode === '3D') ? '2D' : '3D';
  return {
    type: types.SWITCH_MODE,
    mode
  }
};

/**
 * Finished map initialization
 * @function <i>mapActions</i> <strong>didInit</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const didInit: DidInitActionCreator = () => {
  return {
    type: types.DID_INIT
  }
};
