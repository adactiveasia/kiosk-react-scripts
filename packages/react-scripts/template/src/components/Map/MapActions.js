/**
 * Map actions types
 * @memberof! module:Map#
 * @name ActionsTypes
 * @alias ActionsTypes
 * @property {constant} SWITCH_MODE switch between 2d/3d
 */
export const types = {
    SWITCH_MODE: 'map/SWITCH_MODE',
};


/**
 * Switching between 3D and 2D
 * @function <i>mapActions</i> <strong>switchMode</strong>
 * @memberof! module:Map#
 * @returns {object}
 */
let mode = "3D";
export const switchMode = () => {
    mode = (mode == "3D") ? "2D" : "3D";
    return {
        type: types.SWITCH_MODE,
        mode
    }
};
