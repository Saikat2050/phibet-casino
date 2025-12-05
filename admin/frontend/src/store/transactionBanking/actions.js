import {
	FETCH_TRANSACTION_BANKING_FAIL,
	FETCH_TRANSACTION_BANKING_START,
	FETCH_TRANSACTION_BANKING_SUCCESS,
	GET_LEDGER_DETAILS_FAIL,
	GET_LEDGER_DETAILS_START,
	GET_LEDGER_DETAILS_SUCCESS,
	RESET_TRANSACTION_BANKING_DATA,
} from './actionTypes';

export const fetchTransactionBankingStart = (payload) => ({
	type: FETCH_TRANSACTION_BANKING_START,
	payload,
});

export const fetchTransactionBankingSuccess = (payload) => ({
	type: FETCH_TRANSACTION_BANKING_SUCCESS,
	payload,
});

export const fetchTransactionBankingFail = (history) => ({
	type: FETCH_TRANSACTION_BANKING_FAIL,
	payload: { history },
});

export const getLedgerDetailsStart = (payload) => ({
	type: GET_LEDGER_DETAILS_START,
	payload,
});

export const getLedgerDetailsSuccess = (payload) => ({
	type: GET_LEDGER_DETAILS_SUCCESS,
	payload,
});

export const getLedgerDetailsFail = (history) => ({
	type: GET_LEDGER_DETAILS_FAIL,
	payload: { history },
});

export const resetTransactionBankingData = (payload) => ({
	type: RESET_TRANSACTION_BANKING_DATA,
	payload,
});
