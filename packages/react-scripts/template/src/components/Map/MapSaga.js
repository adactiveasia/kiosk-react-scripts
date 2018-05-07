// @flow

import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';
import { SCENE_EVENTS, MOUSE_EVENTS } from '@adactive/adsum-web-map';

import { types as mapActionTypes, floorDidChanged, onClick } from './MapActions';
import mapController from './MapController';
import sceneController from './controllers/SceneController';
import selectionController from './controllers/SelectionController';

import store from '../../store/index';
import type { FloorWillChangeActionType } from './MapActions';

const { init } = mapController;

const {
    getAllFloors,
    getAllBuildings,
    setCurrentFloor
} = sceneController;

/* ------------------------------------ MAP EVENT  --------------------------------------------*/
const initMapEvents = () => {
    mapController.awm.sceneManager.addEventListener(
        SCENE_EVENTS.floor.didChanged,
        (floorDidChangedEvent) => {
            const currentFloor = floorDidChangedEvent.current;
            const previousFloor = floorDidChangedEvent.previous === null ? null : floorDidChangedEvent.previous;

            store.dispatch(floorDidChanged(
                (currentFloor === null ? null : currentFloor.id),
                (previousFloor === null ? null : previousFloor.id),
            ));
        }
    );

    mapController.awm.mouseManager.addEventListener(
        MOUSE_EVENTS.click,
        (event) => {
            selectionController.setEvent(event);
            store.dispatch(onClick(selectionController.getEvent.bind(selectionController)));
        }
    );
};

/* ------------------------------------ MAP ASYNC METHODS  --------------------------------------------*/
function* onInit() {
    yield delay(200);
    yield call([mapController, init]);

    initMapEvents();

    const currentFloor = sceneController.getCurrentFloor();

    yield put({
        type: mapActionTypes.DID_INIT,
        floors: getAllFloors.bind(sceneController),
        buildings: getAllBuildings.bind(sceneController),
        currentFloor: currentFloor === null ? null : currentFloor.id
    });
}

function* onSetCurrentFloor(action: FloorWillChangeActionType) {
    yield delay(200);
    yield call([sceneController, setCurrentFloor], action.floorID);
}

function* mapSaga() {
    yield takeLatest(mapActionTypes.WILL_INIT, onInit);
    yield takeLatest(mapActionTypes.FLOOR_WILL_CHANGE, onSetCurrentFloor);
}

export default mapSaga;
