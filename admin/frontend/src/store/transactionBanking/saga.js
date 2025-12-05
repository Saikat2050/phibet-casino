import { call, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import {
	FETCH_TRANSACTION_BANKING_START,
	GET_LEDGER_DETAILS_START,
} from './actionTypes';
import {
	fetchTransactionBankingFail,
	fetchTransactionBankingSuccess,
	getLedgerDetailsFail,
	getLedgerDetailsSuccess,
} from './actions';
import {
	getLedgerDetails,
	getTransactionBanking,
} from '../../network/getRequests';

function* fetchTransactionBanking(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getTransactionBanking, payload);
		yield put(fetchTransactionBankingSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchTransactionBankingFail(error));
	}
}

function* getLedgerDetailsWorker(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getLedgerDetails, payload);
		yield put(getLedgerDetailsSuccess(response?.data?.data));
	} catch (error) {
		yield put(getLedgerDetailsFail(error));
	}
}

function* transactionBankingSaga() {
	yield takeEvery(FETCH_TRANSACTION_BANKING_START, fetchTransactionBanking);
	yield takeEvery(GET_LEDGER_DETAILS_START, getLedgerDetailsWorker);
}

export default transactionBankingSaga;
