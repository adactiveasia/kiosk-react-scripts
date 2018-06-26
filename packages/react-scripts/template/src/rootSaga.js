import { all } from 'redux-saga/effects';

import mapSaga from '@adactive/arc-map/src/MapSaga';

export default function* rootSaga() {
    yield all([
        mapSaga()
    ]);
}
