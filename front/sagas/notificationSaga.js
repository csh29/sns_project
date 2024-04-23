import { all, call, delay, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { noti, notiAction } from '../reducers/notification';

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

function receptionAllNotiAPI() {
  return axios.post('/notification/all/reception');
}

function* receptionAllNoti(action) {
  try{
    const result = yield call(receptionAllNotiAPI);
    yield put({
      type: notiAction.receptionAllNotiSuccess,
      data: result.data
    })
  } catch(err) {
    console.error(err);
    yield put({
      type: notiAction.receptionAllNotiFailure,
      error: err.response.data
    })
  }
}


function* takeReception () {
    yield takeLatest(notiAction.receptionRequest, reception);
}
function* takeLogout () {
    yield takeLatest(notiAction.logoutRequest, logout);
}
function* takereceptionAllNoti() {
  yield takeLatest(notiAction.receptionAllNotiRequest,receptionAllNoti);
}



export default function* postSaga() {
    yield all([
        fork(takeReception),
        fork(takeLogout),
        fork(takereceptionAllNoti),
    ])
}
