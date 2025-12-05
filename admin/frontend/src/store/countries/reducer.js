import {
	FETCH_COUNTRIES_FAIL,
	FETCH_COUNTRIES_START,
	FETCH_COUNTRIES_SUCCESS,
	UPDATE_COUNTRIES_STATUS_START,
	UPDATE_COUNTRIES_STATUS_SUCCESS,
	UPDATE_COUNTRIES_STATUS_FAIL,
	EDIT_COUNTRIES_START,
	EDIT_COUNTRIES_FAIL,
	EDIT_COUNTRIES_SUCCESS,
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

const initialState = {
	countries: null,
	error: '',
	loading: false,
	updateCountriesStatus: false,
	updateCountriesStatusError: null,
	updateCountriesStatusLoading: false,
	editCountriesSuccess: false,
	editCountriesError: null,
	editCountriesLoading: false,
	restrictedItems: null,
	restrictedItemsError: null,
	restrictedItemsLoading: false,
	unrestrictedItems: null,
	unrestrictedItemsError: null,
	unrestrictedItemsLoading: false,
	removeRestrictedItems: false,
	removeRestrictedItemsError: null,
	removeRestrictedItemsLoading: false,
	addRestrictedItems: false,
	addRestrictedItemsError: null,
	addRestrictedItemsLoading: false,
};

const countriesReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case FETCH_COUNTRIES_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_COUNTRIES_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_COUNTRIES_SUCCESS:
			return {
				...state,
				loading: false,
				countries: payload,
			};
		case RESET_COUNTRIES_DATA:
			return {
				...state,
				loading: false,
				countries: null,
				error: '',
			};
		case UPDATE_COUNTRIES_STATUS_START:
			return {
				...state,
				updateCountriesStatusLoading: true,
				updateCountriesStatus: false,
				updateCountriesStatusError: null,
			};
		case UPDATE_COUNTRIES_STATUS_FAIL:
			return {
				...state,
				updateCountriesStatusLoading: false,
				updateCountriesStatusError: payload,
				updateCountriesStatus: false,
			};
		case UPDATE_COUNTRIES_STATUS_SUCCESS:
			return {
				...state,
				updateCountriesStatusLoading: false,
				updateCountriesStatus: true,
				updateCountriesStatusError: false,
			};

		case EDIT_COUNTRIES_START:
			return {
				...state,
				editCountriesLoading: true,
				editCountriesSuccess: false,
				editCountriesError: null,
			};
		case EDIT_COUNTRIES_FAIL:
			return {
				...state,
				editCountriesLoading: false,
				editCountriesError: payload,
				editCountriesSuccess: false,
			};
		case EDIT_COUNTRIES_SUCCESS:
			return {
				...state,
				editCountriesLoading: false,
				editCountriesSuccess: true,
				editCountriesError: false,
			};
		case FETCH_RESTRICTED_ITEMS_START:
			return {
				...state,
				restrictedItemsLoading: true,
			};
		case FETCH_RESTRICTED_ITEMS_FAIL:
			return {
				...state,
				restrictedItemsLoading: false,
				restrictedItemsError: payload,
				restrictedItems: null,
			};
		case FETCH_RESTRICTED_ITEMS_SUCCESS:
			return {
				...state,
				restrictedItemsLoading: false,
				restrictedItems: payload,
				restrictedItemsError: null,
			};
		case RESET_RESTRICTED_ITEMS_DATA:
			return {
				...state,
				restrictedItemsLoading: false,
				restrictedItems: null,
				restrictedItemsError: null,
			};
		case RESET_UNRESTRICTED_ITEMS_DATA:
			return {
				...state,
				unrestrictedItemsLoading: false,
				unrestrictedItems: null,
				unrestrictedItemsError: null,
			};
		case FETCH_UNRESTRICTED_ITEMS_START:
			return {
				...state,
				unrestrictedItemsLoading: true,
			};
		case FETCH_UNRESTRICTED_ITEMS_FAIL:
			return {
				...state,
				unrestrictedItemsLoading: false,
				unrestrictedItemsError: payload,
				unrestrictedItems: null,
			};
		case FETCH_UNRESTRICTED_ITEMS_SUCCESS:
			return {
				...state,
				unrestrictedItemsLoading: false,
				unrestrictedItems: payload,
				unrestrictedItemsError: null,
			};
		case REMOVE_RESTRICTED_ITEMS_START:
			return {
				...state,
				removeRestrictedItemsLoading: true,
			};
		case REMOVE_RESTRICTED_ITEMS_FAIL:
			return {
				...state,
				removeRestrictedItemsLoading: false,
				removeRestrictedItemsError: payload,
				removeRestrictedItems: false,
			};
		case REMOVE_RESTRICTED_ITEMS_SUCCESS:
			return {
				...state,
				removeRestrictedItemsLoading: false,
				removeRestrictedItems: true,
				removeRestrictedItemsError: null,
			};
		case ADD_RESTRICTED_ITEMS_START:
			return {
				...state,
				addRestrictedItemsLoading: true,
			};
		case ADD_RESTRICTED_ITEMS_FAIL:
			return {
				...state,
				addRestrictedItemsLoading: false,
				addRestrictedItemsError: payload,
				addRestrictedItems: false,
			};
		case ADD_RESTRICTED_ITEMS_SUCCESS:
			return {
				...state,
				addRestrictedItemsLoading: false,
				addRestrictedItems: true,
				addRestrictedItemsError: null,
			};
		default:
			return { ...state };
	}
};

export default countriesReducer;
