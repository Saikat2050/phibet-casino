import { call, put, takeEvery } from 'redux-saga/effects';
// Login Redux States
import { FETCH_CASINO_TRANSACTIONS_START } from './actionTypes';
import {
	fetchCasinoTransactionsFail,
	fetchCasinoTransactionsSuccess,
} from './actions';
import { getCasinoTransactions } from '../../network/getRequests';

function* fetchCasinoTransactions(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getCasinoTransactions, payload);
		yield put(fetchCasinoTransactionsSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchCasinoTransactionsFail(error));
	}
}

function* casinoTransactionsSaga() {
	yield takeEvery(FETCH_CASINO_TRANSACTIONS_START, fetchCasinoTransactions);
}

export default casinoTransactionsSaga;
