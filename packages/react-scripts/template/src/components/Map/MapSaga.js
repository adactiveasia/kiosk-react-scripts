// @flow

import { delay } from 'redux-saga';
import { put, call, takeLatest } from 'redux-saga/effects';

import { types as mapActionTypes } from "./MapActions";
import mapController from "./MapController";

import type { DidInitAction } from "./MapActions";

const { init } = mapController;

function* onInit() {
  const didInitAction: DidInitAction = {
    type: mapActionTypes.DID_INIT,
  };
  yield delay(200);
  yield call([mapController, init]);
  yield put(didInitAction);
}

function* mapSaga() {
  yield takeLatest(mapActionTypes.WILL_INIT, onInit);
}

export default mapSaga;
