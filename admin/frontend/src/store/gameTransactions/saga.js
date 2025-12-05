import { call, put, takeEvery } from 'redux-saga/effects';
// Login Redux States
import { FETCH_GAME_TRANSACTIONS_START } from './actionTypes';
import {
	fetchGameTransactionsFail,
	fetchGameTransactionsSuccess,
} from './actions';
import { getGameReports } from '../../network/getRequests';

function* fetchGameTransactions(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getGameReports, payload);
		yield put(fetchGameTransactionsSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchGameTransactionsFail(error));
	}
}

function* gameTransactionsSaga() {
	yield takeEvery(FETCH_GAME_TRANSACTIONS_START, fetchGameTransactions);
}

export default gameTransactionsSaga;
