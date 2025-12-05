import {
	FETCH_CASINO_TRANSACTIONS_FAIL,
	FETCH_CASINO_TRANSACTIONS_START,
	FETCH_CASINO_TRANSACTIONS_SUCCESS,
	RESET_CASINO_TRANSACTIONS_DATA,
} from './actionTypes';

export const fetchCasinoTransactionsStart = (payload) => ({
	type: FETCH_CASINO_TRANSACTIONS_START,
	payload,
});

export const fetchCasinoTransactionsSuccess = (payload) => ({
	type: FETCH_CASINO_TRANSACTIONS_SUCCESS,
	payload,
});

export const fetchCasinoTransactionsFail = (history) => ({
	type: FETCH_CASINO_TRANSACTIONS_FAIL,
	payload: { history },
});

export const resetCasinoTransactionsData = (payload) => ({
	type: RESET_CASINO_TRANSACTIONS_DATA,
	payload,
});
