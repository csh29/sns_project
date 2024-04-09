import { all, call, delay, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { notiAction } from '../reducers/notification';



function addNotificationAPI(data) {
  return axios.post(`/notification/`,data);
}


function* addNotification(action) {
    try {
        const result = yield call(addNotificationAPI,action.payload);
        yield put({
          type: notiAction.addNotificationSuccess,
          data: action.payload,
        });
    } catch (err) {
        console.error(err);
        yield put({
          type: notiAction.addNotificationFailure,
          error: err.response.data,
        });
    }
}

function receptionAPI(data) {
  return axios.post(`/notification/reception`,data);
}


function* reception(action) {
    try {
        const result = yield call(receptionAPI,action.payload);
        yield put({
          type: notiAction.receptionSuccess,
          data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
          type: notiAction.receptionFailure,
          error: err.response.data,
        });
    }
}

function logoutAPI(data) {
  return axios.post(`/notification/logout`,data);
}


function* logout(action) {
    try {
        const result = yield call(logoutAPI,action.payload);
        yield put({
          type: notiAction.logoutSuccess,
          data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
          type: notiAction.logoutFailure,
          error: err.response.data,
        });
    }
}


function* takeAddNotification () {
    yield takeLatest(notiAction.addNotificationRequest, addNotification);
}
function* takeReception () {
    yield takeLatest(notiAction.receptionRequest, reception);
}
function* takeLogout () {
    yield takeLatest(notiAction.logoutRequest, logout);
}



export default function* postSaga() {
    yield all([
        fork(takeAddNotification),
        fork(takeReception),
        fork(takeLogout),
    ])
}
