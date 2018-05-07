import selectionController from './controllers/SelectionController';

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


/**
 * Init adsum web map
 * @function <i>mapActions</i> <strong>init</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const init = () => {
    return {
        type: types.WILL_INIT,
    }
};

/**
 * Switching between 3D and 2D
 * @function <i>mapActions</i> <strong>switchMode</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
let mode = "3D";
export const switchMode = () => {
    mode = (mode === "3D") ? "2D" : "3D";
    return {
        type: types.SWITCH_MODE,
        mode
    }
};

/**
 * Change floor
 * @function <i>mapActions</i> <strong>changeFloor</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const changeFloor = (floorID) => {
    return {
        type: types.FLOOR_WILL_CHANGE,
        floorID
    }
};

/**
 * floor did change
 * @function <i>mapActions</i> <strong>floorDidChanged</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const floorDidChanged = (currentFloor,previousFloor) => {
    return {
        type: types.FLOOR_DID_CHANGE,
        currentFloor,
        previousFloor,
    }
};

/**
 * Trigger on click on the map
 * @function <i>mapActions</i> <strong>onClick</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
export const onClick = (getEventMethod) => {
    selectionController.onClick();
    return {
        type: types.ON_CLICK,
        currentClickedEvent: getEventMethod
    }
};

