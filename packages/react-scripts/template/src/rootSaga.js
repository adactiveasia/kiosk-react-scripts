import {all} from 'redux-saga/effects';

import mapSaga from "./components/Map/MapSaga";

export default function* rootSaga() {
    yield all([
        mapSaga()
    ]);
}