import { all, fork } from 'redux-saga/effects';
import userSaga from './userSaga';
import postSaga from './postSaga';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3010';
axios.defaults.withCredentials = true;


export default function* rootSaga() {
	yield all([
		fork(userSaga),
		fork(postSaga),
	]);
}
