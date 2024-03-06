import { all, fork } from 'redux-saga/effects';
import userSaga from './userSaga';
import postSaga from './postSaga';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_NODE_SERVER;
axios.defaults.withCredentials = true;


export default function* rootSaga() {
	yield all([
		fork(userSaga),
		fork(postSaga),
	]);
}
