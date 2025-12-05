import { call, put, takeEvery } from 'redux-saga/effects';
// Login Redux States
import { FETCH_SPORTS_BET_START } from './actionTypes';
import { fetchSportsBetFail, fetchSportsBetSuccess } from './actions';
import { getSportsBet } from '../../network/getRequests';

function* fetchSportsBet(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getSportsBet, payload);
		yield put(fetchSportsBetSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchSportsBetFail(error));
	}
}

function* sportsBetSaga() {
	yield takeEvery(FETCH_SPORTS_BET_START, fetchSportsBet);
}

export default sportsBetSaga;
