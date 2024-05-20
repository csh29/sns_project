import { all, call, delay, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { userAction } from '../reducers/user'

function logInAPI(data) {
  return axios.post("/user/login",data);
}


function* logIn(action) {
    try {
        const result = yield call(logInAPI,action.payload);
        yield put({
          type: userAction.loginSuccess,
          data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
          type: userAction.loginFailure,
          error: err.response.data,
        });
    }
}

function logoutAPI(data) {
  return axios.post("/user/logout",data);
}

function* logout(action) {
  try {
      const result = yield call(logoutAPI,action.payload);
      yield put({
        type: userAction.logoutSuccess,
        data: action.payload,
      });
  } catch (err) {
      console.error(err);
      yield put({
        type: userAction.logoutFailure,
        error: err.response.data,
      });
  }
}

function signupAPI(data) {
  return axios.post("/user/signup",data);
}

function* signup(action) {
  try {
      const result = yield call(signupAPI,action.payload);
      yield put({
        type: userAction.signupSuccess,
        data: action.payload,
      });
  } catch (err) {
      console.error(err);
      yield put({
        type: userAction.signupFailure,
        error: err.response.data,
      });
  }
}


function loadUserAPI(data) {
  return axios.get("/user/",data);
}

function* loadUser(action) {
  try {
      const result = yield call(loadUserAPI,action.payload);
      yield put({
        type: userAction.loadUserSuccess,
        data: result.data,
      });
  } catch (err) {
      console.error(err);
      yield put({
        type: userAction.loadUserFailure,
        error: err.response.data,
      });
  }
}

function followAPI(data) {
  return axios.post('/user/follow',data);
}

function* follow(action) {
  try{
    const result = yield call(followAPI,action.payload);
    yield put({
      type:userAction.followSuccess,
      data:result.data
    })
  } catch(err) {
    yield put({
      type: userAction.followFailure,
      error: err.response.data
    })
  }
}

function updateNicknameAPI(data) {
  return axios.post("/user/updatenickname",data,option);
}

function* updateNickname(action) {
  try{
    const result = yield call(updateNicknameAPI, action.payload)
    yield put({
      type: userAction.updateNicknameSuccess,
      data: result.data
    })
  } catch (err) {
    yield put({
      type: userAction.updateNicknameFailure,
      error: err.response.data
    })
  }
}

function updateRecptionAPI(data) {
  return axios.post('/user/update/reception',data);
}

function* updateRecption(action) {
  try{
    const result = yield call(updateRecptionAPI, action.payload);
    yield put({
      type: userAction.updateRecptionSuccess,
      data: result.data,
    })
  } catch(err) {
    console.log(err);
    yield put({
      type: userAction.updateRecptionFailure,
      error: err.response.data
    })
  }
}

function uploadProfileImgAPI(data) {
  return axios.post(`/upload/profile`,data.formData);
}

function* uploadProfileImg(action) {
  try{
    const result = yield call(uploadProfileImgAPI , action.payload);
    yield put({
      type: userAction.uploadProfileImgSuccess,
      data: result.data
    })
  } catch (err) { 
    console.log(err)
    yield put({
      type: userAction.uploadProfileImgFailure,
      error: err.response.data
    })
  }
}

function removeProfileImgAPI() {
  return axios.post("/upload/remove/profile");
}
  
function* removeProfileImg(action) {
  try {
    const result = yield call(removeProfileImgAPI);
    yield put({
      type: userAction.removeProfileImgSuccess,
      data: result.data
    })
  } catch (err) { 
    console.log(err);
    yield put({
      type: userAction.removeProfileImgFailure,
      error: err.response.data
    })
  }
}

function searchUserAPI(data) {
  return axios.get(`/user/search/${data.userId}`);
}
  
function* searchUser(action) {
  try {
    const result = yield call(searchUserAPI,action.payload);
    yield put({
      type: userAction.searchUserSuccess,
      data: result.data
    })
  } catch (err) { 
    console.log(err);
    yield put({
      type: userAction.searchUserFailure,
      error: err.response.data
    })
  }
}

function updateProfileAPI(data) {
  return axios.post(`/user/profile/`,data);
}
  
function* updateProfile(action) {
  try {
    const result = yield call(updateProfileAPI,action.payload);
    yield put({
      type: userAction.updateProfileSuccess,
      data: result.data
    })
  } catch (err) { 
    console.log(err);
    yield put({
      type: userAction.updateProfileFailure,
      error: err.response.data
    })
  }
}

function* takeLogin () {
    yield takeLatest(userAction.loginRequest, logIn);
}

function* takeLogout () {
  yield takeLatest(userAction.logoutRequest, logout);
}

function* takeSignup () {
  yield takeLatest(userAction.signupRequest, signup);
}

function* takeLoadUser () {
  yield takeLatest(userAction.loadUserRequest, loadUser);
}

function* takeFollow () {
  yield takeLatest(userAction.followRequest, follow);
}

function* takeUpdateNickname() {
  yield takeLatest(userAction.updateNicknameRequest, updateNickname);
}

function* takeUpdateRecption() {
  yield takeLatest(userAction.updateRecptionRequest, updateRecption)
}

function* takeUploadProfileImg() {
  yield takeLatest(userAction.uploadProfileImgRequest, uploadProfileImg)
}

function* takeRemoveProfileImg() {
  yield takeLatest(userAction.removeProfileImgRequest, removeProfileImg)
}

function* takeSearchUser() {
  yield takeLatest(userAction.searchUserRequest, searchUser)
}

function* takeUpdateProfile() {
  yield takeLatest(userAction.updateProfileRequest, updateProfile)
}

export default function* userSaga() {
    yield all([
      fork(takeLogin),
      fork(takeLogout),
      fork(takeSignup),
      fork(takeLoadUser),
      fork(takeFollow),
      fork(takeUpdateNickname),
      fork(takeUpdateRecption),
      fork(takeUploadProfileImg),
      fork(takeRemoveProfileImg),
      fork(takeSearchUser),
      fork(takeUpdateProfile),
    ]);
  }

  