import { put, call, takeEvery, take } from 'redux-saga/effects';

import {types as mapActionTypes} from "./MapActions";
import mapController from "./MapController";

const {
    init,
    switchMode,
} = mapController;

function* onSwitchMode(action) {
    const mode = action.type;
    yield call([mapController, switchMode], mode);

    yield put({
        type: mapActionTypes.SWITCH_MODE,
        mode
    });
}

function* onInit() {
    yield call([mapController, init]);
    console.log("init")
    yield put({
        type: mapActionTypes.DID_INIT,
    });
}


function* mapSaga() {
    yield takeEvery(mapActionTypes.WILL_INIT, onInit);
    yield takeEvery(mapActionTypes.SWITCH_MODE, onSwitchMode);
}

export default mapSaga;