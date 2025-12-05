import { call, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import { FETCH_PLAYERS_START } from './actionTypes';
import { fetchPlayersFail, fetchPlayersSuccess } from './actions';
import { getPlayers } from '../../network/getRequests';

function* fetchPlayers({ payload }) {
	try {
		const response = yield call(getPlayers, payload);
		yield put(fetchPlayersSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchPlayersFail(error));
	}
}

function* playersSaga() {
	yield takeEvery(FETCH_PLAYERS_START, fetchPlayers);
}

export default playersSaga;
