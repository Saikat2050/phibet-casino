import {
	ADD_RESTRICTED_COUNTRIES_FAIL,
	ADD_RESTRICTED_COUNTRIES_START,
	ADD_RESTRICTED_COUNTRIES_SUCCESS,
} from './actionTypes';

export const addRestrictedCountriesStart = (payload) => ({
	type: ADD_RESTRICTED_COUNTRIES_START,
	payload,
});

export const addRestrictedCountriesSuccess = (payload) => ({
	type: ADD_RESTRICTED_COUNTRIES_SUCCESS,
	payload,
});

export const addRestrictedCountriesFail = (payload) => ({
	type: ADD_RESTRICTED_COUNTRIES_FAIL,
	payload,
});
