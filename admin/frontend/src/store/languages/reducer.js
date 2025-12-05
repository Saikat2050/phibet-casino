import {
	FETCH_LANGUAGES_FAIL,
	FETCH_LANGUAGES_START,
	FETCH_LANGUAGES_SUCCESS,
	RESET_LANGUAGES_DATA,
} from './actionTypes';

const initialState = {
	languages: null,
	error: '',
	loading: false,
};

const languagesReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case FETCH_LANGUAGES_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_LANGUAGES_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_LANGUAGES_SUCCESS:
			return {
				...state,
				loading: false,
				languages: payload,
			};
		case RESET_LANGUAGES_DATA:
			return {
				...state,
				loading: false,
				languages: null,
				error: '',
			};
		default:
			return { ...state };
	}
};

export default languagesReducer;
