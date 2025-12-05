import {
	FETCH_LANGUAGE_MANAGEMENT_FAIL,
	FETCH_LANGUAGE_MANAGEMENT_START,
	FETCH_LANGUAGE_MANAGEMENT_SUCCESS,
	RESET_LANGUAGE_MANAGEMENT_DATA,
} from './actionTypes';

const initialState = {
	languageManagement: null,
	error: '',
	loading: false,
};

const languageManagementReducer = (
	state = initialState,
	{ type, payload } = {}
) => {
	switch (type) {
		case FETCH_LANGUAGE_MANAGEMENT_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_LANGUAGE_MANAGEMENT_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_LANGUAGE_MANAGEMENT_SUCCESS:
			return {
				...state,
				loading: false,
				languageManagement: payload,
			};
		case RESET_LANGUAGE_MANAGEMENT_DATA:
			return {
				...state,
				loading: false,
				error: '',
				languageManagement: null,
			};
		default:
			return { ...state };
	}
};

export default languageManagementReducer;
