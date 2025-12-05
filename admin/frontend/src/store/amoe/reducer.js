import {
	FETCH_AMOE_FAIL,
	FETCH_AMOE_START,
	FETCH_AMOE_SUCCESS,
	EDIT_AMOE_START,
	EDIT_AMOE_SUCCESS,
	EDIT_AMOE_FAIL,
	RESET_AMOE_DATA,
	AMOE_STATUS_START,
	AMOE_STATUS_FAIL,
	AMOE_STATUS_SUCCESS,
} from './actionTypes';

const initialState = {
	amoeRequests: null,
	error: '',
	loading: false,

	isEditAmoeError: false,
	isEditAmoeSuccess: false,
	isEditAmoeLoading: false,
	amoeStatusLoading: false,
};

const notificationReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case FETCH_AMOE_START:
			return {
				...state,
				loading: true,
			};

		case FETCH_AMOE_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};

		case FETCH_AMOE_SUCCESS:
			return {
				...state,
				loading: false,
				amoeRequests: payload,
			};

		case RESET_AMOE_DATA:
			return {
				...state,
				loading: false,
				amoeRequests: null,
				error: '',
			};

		case EDIT_AMOE_START:
			return {
				...state,
				isEditAmoeLoading: true,
				isEditAmoeSuccess: false,
			};

		case EDIT_AMOE_SUCCESS:
			return {
				...state,
				isEditAmoeLoading: false,
				isEditAmoeSuccess: true,
			};

		case EDIT_AMOE_FAIL:
			return {
				...state,
				isEditAmoeError: payload,
				isEditAmoeLoading: false,
				isEditAmoeSuccess: false,
			};
		case AMOE_STATUS_START:
			return {
				...state,
				amoeStatusLoading: true,
			};
		case AMOE_STATUS_FAIL:
			return {
				...state,
				amoeStatusLoading: false,
			};
		case AMOE_STATUS_SUCCESS:
			return {
				...state,
				amoeStatusLoading: false,
			};

		default:
			return { ...state };
	}
};

export default notificationReducer;
