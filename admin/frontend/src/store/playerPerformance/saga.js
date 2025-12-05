import { call, put, takeEvery } from 'redux-saga/effects';
// Login Redux States
import { FETCH_PLAYER_PERFORMANCE_START } from './actionTypes';
import {
	fetchPlayerPerformanceFail,
	fetchPlayerPerformanceSuccess,
} from './actions';
import { getTopPlayersRequest } from '../../network/getRequests';

function* fetchPlayerPerformanceSaga(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getTopPlayersRequest, payload);
		yield put(fetchPlayerPerformanceSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchPlayerPerformanceFail(error));
	}
}

function* playerPerformanceSaga() {
	yield takeEvery(FETCH_PLAYER_PERFORMANCE_START, fetchPlayerPerformanceSaga);
}

export default playerPerformanceSaga;
