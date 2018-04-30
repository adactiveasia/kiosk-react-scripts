import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';

import {types as mapActionTypes} from "./MapActions";
import mapController from "./MapController";
import sceneController from './controllers/SceneController';

const {
    init,
} = mapController;

const {
    getAllFloors,
    getAllBuildings
} = sceneController;

function* onInit() {
    yield delay(200);
    yield call([mapController, init]);
    yield put({
        type: mapActionTypes.DID_INIT,
        floors: getAllFloors.bind(sceneController),
        buildings: getAllBuildings.bind(sceneController)
    });
}

function* mapSaga() {
    yield takeLatest(mapActionTypes.WILL_INIT, onInit);
}

export default mapSaga;