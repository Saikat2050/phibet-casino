import {
	FETCH_LANGUAGE_MANAGEMENT_FAIL,
	FETCH_LANGUAGE_MANAGEMENT_START,
	FETCH_LANGUAGE_MANAGEMENT_SUCCESS,
	RESET_LANGUAGE_MANAGEMENT_DATA,
} from './actionTypes';

export const fetchLanguageManagementStart = (payload) => ({
	type: FETCH_LANGUAGE_MANAGEMENT_START,
	payload,
});

export const fetchLanguageManagementSuccess = (payload) => ({
	type: FETCH_LANGUAGE_MANAGEMENT_SUCCESS,
	payload,
});

export const fetchLanguageManagementFail = (history) => ({
	type: FETCH_LANGUAGE_MANAGEMENT_FAIL,
	payload: { history },
});

export const resetLanguageManagementData = (payload) => ({
	type: RESET_LANGUAGE_MANAGEMENT_DATA,
	payload,
});
