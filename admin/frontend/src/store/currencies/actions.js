import {
	FETCH_CURRENCIES_FAIL,
	FETCH_CURRENCIES_START,
	FETCH_CURRENCIES_SUCCESS,
	CREATE_CURRENCIES_FAIL,
	CREATE_CURRENCIES_START,
	CREATE_CURRENCIES_SUCCESS,
	EDIT_CURRENCIES_SUCCESS,
	EDIT_CURRENCIES_FAIL,
	EDIT_CURRENCIES_START,
	RESET_CURRENCIES_DATA,
	TOGGLE_CURRENCY,
} from './actionTypes';

export const fetchCurrenciesStart = (payload) => ({
	type: FETCH_CURRENCIES_START,
	payload,
});

export const fetchCurrenciesSuccess = (currencies) => ({
	type: FETCH_CURRENCIES_SUCCESS,
	payload: currencies,
});

export const fetchCurrenciesFail = (history) => ({
	type: FETCH_CURRENCIES_FAIL,
	payload: { history },
});

export const resetCurrenciesData = (history) => ({
	type: RESET_CURRENCIES_DATA,
	payload: { history },
});

export const createCurrencySuccess = (payload) => ({
	type: CREATE_CURRENCIES_SUCCESS,
	payload,
});

export const createCurrencyFail = (payload) => ({
	type: CREATE_CURRENCIES_FAIL,
	payload,
});

export const createCurrencyStart = (payload) => ({
	type: CREATE_CURRENCIES_START,
	payload,
});

export const editCurrencySuccess = (payload) => ({
	type: EDIT_CURRENCIES_SUCCESS,
	payload,
});

export const editCurrencyFail = (payload) => ({
	type: EDIT_CURRENCIES_FAIL,
	payload,
});

export const editCurrencyStart = (payload) => ({
	type: EDIT_CURRENCIES_START,
	payload,
});

export const toggleCurrency = (payload) => ({
	type: TOGGLE_CURRENCY,
	payload,
});
