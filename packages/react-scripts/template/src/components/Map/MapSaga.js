import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';

import {types as mapActionTypes} from "./MapActions";
import mapController from "./MapController";

const {
    init,
} = mapController;

function* onInit() {
    yield delay(200);
    yield call([mapController, init]);
    yield put({
        type: mapActionTypes.DID_INIT,
    });
}

function* mapSaga() {
    yield takeLatest(mapActionTypes.WILL_INIT, onInit);
}

export default mapSaga;