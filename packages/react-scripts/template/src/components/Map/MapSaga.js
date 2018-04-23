import {takeEvery, call, put} from "redux-saga/effects";
import {types as mapActionTypes} from "./MapActions";
import mapCtr from "./MapController";
import {types as instructionListTypes} from "../InstructionList/InstructionListActions";

const {
    getClosestPlace,
    getCurrentFloorName,
    getHomeFloor,
    getPathDirection,
    drawPathSection,
    drawPathToPlace,
    getWalkingTime,
    displayFloor
} = mapCtr;

function* toFloorsList(pathSections) {
    const floorsList = [];
    for (const section of pathSections) {
        const floorId = yield call([section, section.getFloorId]);
        const floorName = yield call([mapCtr, getCurrentFloorName], floorId);
        const distance = yield call([section, section.getLength]);
        const walkingTime = yield call([mapCtr, getWalkingTime], distance);
        floorsList.push({
            name: floorName,
            floorId,
            distance,
            pathSection: section,
            walkingTime
        });
    }
    return floorsList;
}

function* onDrawPathToPoi(action) {
    yield put({
        type: mapActionTypes.UPDATE_PATH_INFO,
        path: null,
        pathFloorsList: []
    });
    yield put({type: instructionListTypes.OPEN_INSTRUCTION_LIST});

    const place = yield call([mapCtr, getClosestPlace], action.poi_id);
    const path = yield call([mapCtr, drawPathToPlace], place);
    const pathFloorsList = yield* toFloorsList(path.pathSections);
    const pathDirection = yield call([mapCtr, getPathDirection], path);

    yield put({
        type: mapActionTypes.UPDATE_PATH_INFO,
        path,
        pathFloorsList,
        pathDirection
    });
}

function* onDrawPathSection(action) {
    const pathSection = action.section;
    if (!pathSection.isEmpty()) {
        yield call([mapCtr, drawPathSection], pathSection, action.path, true);
    } else {
        const floorId = yield call([pathSection, pathSection.getFloorId]);
        yield call([mapCtr, displayFloor], floorId);
    }
}

function* onDisplayFloor(action) {
    yield call([mapCtr, displayFloor], action.floorId);
}

function* onFetchHomeFloor() {
    const homeFloor = yield call([mapCtr, getHomeFloor]);

    yield put({
        type: mapActionTypes.UPDATE_HOME_FLOOR,
        homeFloor
    });
}

function* mapSaga() {
    yield takeEvery(mapActionTypes.DRAW_PATH_TO_POI, onDrawPathToPoi);
    yield takeEvery(mapActionTypes.DRAW_PATH_SECTION, onDrawPathSection);
    yield takeEvery(mapActionTypes.DISPLAY_FLOOR, onDisplayFloor);
    yield takeEvery(mapActionTypes.FETCH_HOME_FLOOR, onFetchHomeFloor);
}

export default mapSaga;