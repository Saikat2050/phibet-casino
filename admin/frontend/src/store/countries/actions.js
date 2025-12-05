import {
	FETCH_COUNTRIES_FAIL,
	FETCH_COUNTRIES_START,
	FETCH_COUNTRIES_SUCCESS,
	UPDATE_COUNTRIES_STATUS_START,
	UPDATE_COUNTRIES_STATUS_SUCCESS,
	UPDATE_COUNTRIES_STATUS_FAIL,
	EDIT_COUNTRIES_START,
	EDIT_COUNTRIES_SUCCESS,
	EDIT_COUNTRIES_FAIL,
	FETCH_RESTRICTED_ITEMS_START,
	FETCH_RESTRICTED_ITEMS_FAIL,
	FETCH_RESTRICTED_ITEMS_SUCCESS,
	FETCH_UNRESTRICTED_ITEMS_START,
	FETCH_UNRESTRICTED_ITEMS_FAIL,
	FETCH_UNRESTRICTED_ITEMS_SUCCESS,
	REMOVE_RESTRICTED_ITEMS_START,
	REMOVE_RESTRICTED_ITEMS_FAIL,
	REMOVE_RESTRICTED_ITEMS_SUCCESS,
	ADD_RESTRICTED_ITEMS_START,
	ADD_RESTRICTED_ITEMS_FAIL,
	ADD_RESTRICTED_ITEMS_SUCCESS,
	RESET_COUNTRIES_DATA,
	RESET_RESTRICTED_ITEMS_DATA,
	RESET_UNRESTRICTED_ITEMS_DATA,
} from './actionTypes';

export const fetchCountriesStart = (payload) => ({
	type: FETCH_COUNTRIES_START,
	payload,
});

export const fetchCountriesSuccess = (countries) => ({
	type: FETCH_COUNTRIES_SUCCESS,
	payload: countries,
});

export const fetchCountriesFail = (history) => ({
	type: FETCH_COUNTRIES_FAIL,
	payload: { history },
});

export const resetCountriesData = (payload) => ({
	type: RESET_COUNTRIES_DATA,
	payload,
});

export const updateCountryStatusStart = (payload) => ({
	type: UPDATE_COUNTRIES_STATUS_START,
	payload,
});

export const updateCountryStatusSuccess = (payload) => ({
	type: UPDATE_COUNTRIES_STATUS_SUCCESS,
	payload,
});

export const updateCountryStatusFail = (payload) => ({
	type: UPDATE_COUNTRIES_STATUS_FAIL,
	payload,
});

export const editCountryStart = (payload) => ({
	type: EDIT_COUNTRIES_START,
	payload,
});

export const editCountrySuccess = (payload) => ({
	type: EDIT_COUNTRIES_SUCCESS,
	payload,
});

export const editCountryFail = (payload) => ({
	type: EDIT_COUNTRIES_FAIL,
	payload,
});

export const fetchRestrictedItemsStart = (payload) => ({
	type: FETCH_RESTRICTED_ITEMS_START,
	payload,
});

export const fetchRestrictedItemsSuccess = (payload) => ({
	type: FETCH_RESTRICTED_ITEMS_SUCCESS,
	payload,
});

export const fetchRestrictedItemsFail = (payload) => ({
	type: FETCH_RESTRICTED_ITEMS_FAIL,
	payload,
});

export const resetRestrictedItemsData = (payload) => ({
	type: RESET_RESTRICTED_ITEMS_DATA,
	payload,
});

export const resetUnrestrictedItemsData = (payload) => ({
	type: RESET_UNRESTRICTED_ITEMS_DATA,
	payload,
});

export const fetchUnrestrictedItemsStart = (payload) => ({
	type: FETCH_UNRESTRICTED_ITEMS_START,
	payload,
});

export const fetchUnrestrictedItemsSuccess = (payload) => ({
	type: FETCH_UNRESTRICTED_ITEMS_SUCCESS,
	payload,
});

export const fetchUnrestrictedItemsFail = (payload) => ({
	type: FETCH_UNRESTRICTED_ITEMS_FAIL,
	payload,
});

export const removeRestrictedItemsStart = (payload) => ({
	type: REMOVE_RESTRICTED_ITEMS_START,
	payload,
});

export const removeRestrictedItemsSuccess = (payload) => ({
	type: REMOVE_RESTRICTED_ITEMS_SUCCESS,
	payload,
});

export const removeRestrictedItemsFail = (payload) => ({
	type: REMOVE_RESTRICTED_ITEMS_FAIL,
	payload,
});

export const addRestrictedItemsStart = (payload) => ({
	type: ADD_RESTRICTED_ITEMS_START,
	payload,
});

export const addRestrictedItemsSuccess = (payload) => ({
	type: ADD_RESTRICTED_ITEMS_SUCCESS,
	payload,
});

export const addRestrictedItemsFail = (payload) => ({
	type: ADD_RESTRICTED_ITEMS_FAIL,
	payload,
});
