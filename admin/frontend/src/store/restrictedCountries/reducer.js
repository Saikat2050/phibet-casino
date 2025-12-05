import {
	ADD_RESTRICTED_COUNTRIES_FAIL,
	ADD_RESTRICTED_COUNTRIES_START,
	ADD_RESTRICTED_COUNTRIES_SUCCESS,
} from './actionTypes';

const initialState = {
	addToRestrictedCountriesSuccess: null,
	addToRestrictedCountriesError: '',
	addToRestrictedCountriesLoading: false,
};

const restrictedCountriesReducer = (state = initialState, { type } = {}) => {
	switch (type) {
		case ADD_RESTRICTED_COUNTRIES_START:
			return {
				...state,
				addToRestrictedCountriesLoading: true,
			};

		case ADD_RESTRICTED_COUNTRIES_FAIL:
			return {
				...state,
				addToRestrictedCountriesSuccess: false,
				addToRestrictedCountriesError: true,
				addToRestrictedCountriesLoading: false,
			};

		case ADD_RESTRICTED_COUNTRIES_SUCCESS:
			return {
				...state,
				addToRestrictedCountriesSuccess: true,
				addToRestrictedCountriesError: false,
				addToRestrictedCountriesLoading: false,
			};

		default:
			return state;
	}
};

export default restrictedCountriesReducer;
