import {
	FETCH_ADMIN_ACTIVITY,
	FETCH_ADMIN_ACTIVITY_SUCCESS,
	FETCH_ADMIN_ACTIVITY_FAIL,
} from './actionTypes';

const initialState = {
	adminActivityData: null,
	error: '',
	loading: false,
};

const adminActivityReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		// Fetch
		case FETCH_ADMIN_ACTIVITY:
			return {
				...state,
				loading: true,
			};
		case FETCH_ADMIN_ACTIVITY_SUCCESS:
			return {
				...state,
				loading: false,
				adminActivityData: payload,
			};
		case FETCH_ADMIN_ACTIVITY_FAIL:
			return {
				...state,
				loading: false,
				error: payload,
			};
		default:
			return state;
	}
};

export default adminActivityReducer;
