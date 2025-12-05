import {
	FETCH_SPORTS_TRANSACTIONS_FAIL,
	FETCH_SPORTS_TRANSACTIONS_START,
	FETCH_SPORTS_TRANSACTIONS_SUCCESS,
	RESET_SPORTS_TRANSACTIONS_DATA,
} from './actionTypes';

export const fetchSportsTransactionsStart = (payload) => ({
	type: FETCH_SPORTS_TRANSACTIONS_START,
	payload,
});

export const fetchSportsTransactionsSuccess = (payload) => ({
	type: FETCH_SPORTS_TRANSACTIONS_SUCCESS,
	payload,
});

export const fetchSportsTransactionsFail = (history) => ({
	type: FETCH_SPORTS_TRANSACTIONS_FAIL,
	payload: { history },
});

export const resetSportsTransactionsData = (payload) => ({
	type: RESET_SPORTS_TRANSACTIONS_DATA,
	payload,
});
