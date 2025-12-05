import {
	FETCH_GAME_TRANSACTIONS_FAIL,
	FETCH_GAME_TRANSACTIONS_START,
	FETCH_GAME_TRANSACTIONS_SUCCESS,
	RESET_GAME_TRANSACTIONS_DATA,
} from './actionTypes';

export const fetchGameTransactionsStart = (payload) => ({
	type: FETCH_GAME_TRANSACTIONS_START,
	payload,
});

export const fetchGameTransactionsSuccess = (payload) => ({
	type: FETCH_GAME_TRANSACTIONS_SUCCESS,
	payload,
});

export const fetchGameTransactionsFail = (history) => ({
	type: FETCH_GAME_TRANSACTIONS_FAIL,
	payload: { history },
});

export const resetGameTransactionsData = (payload) => ({
	type: RESET_GAME_TRANSACTIONS_DATA,
	payload,
});
