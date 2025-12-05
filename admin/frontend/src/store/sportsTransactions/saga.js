import { call, put, takeEvery } from 'redux-saga/effects';
// Login Redux States
import { FETCH_SPORTS_TRANSACTIONS_START } from './actionTypes';
import {
	fetchSportsTransactionsFail,
	fetchSportsTransactionsSuccess,
} from './actions';
import { getSportsTransactions } from '../../network/getRequests';

function* fetchSportsTransactions(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getSportsTransactions, payload);
		yield put(fetchSportsTransactionsSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchSportsTransactionsFail(error));
	}
}

function* sportsTransactionsSaga() {
	yield takeEvery(FETCH_SPORTS_TRANSACTIONS_START, fetchSportsTransactions);
}

export default sportsTransactionsSaga;
