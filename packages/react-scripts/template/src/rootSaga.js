import {spawn} from 'redux-saga/effects';

import mapSaga from "./components/Map/mapSaga";

export default function* mainSaga() {
    yield [
        spawn(mapSaga)
    ];
}