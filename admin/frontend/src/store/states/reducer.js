import {
	FETCH_STATES_FAIL,
	FETCH_STATES_START,
	FETCH_STATES_SUCCESS,
	UPDATE_STATES_STATUS_START,
	UPDATE_STATES_STATUS_SUCCESS,
	UPDATE_STATES_STATUS_FAIL,
	RESET_STATES_DATA,
} from './actionTypes';

const initialState = {
	states: null,
	error: '',
	loading: false,
	updateStatesStatus: false,
	updateStatesStatusError: null,
	updateStatesStatusLoading: false,
};

const statesReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case FETCH_STATES_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_STATES_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_STATES_SUCCESS:
			return {
				...state,
				loading: false,
				states: payload,
			};
		case RESET_STATES_DATA:
			return {
				...state,
				loading: false,
				states: null,
				error: '',
			};
		case UPDATE_STATES_STATUS_START:
			return {
				...state,
				updateStatesStatusLoading: true,
				updateStatesStatus: false,
				updateStatesStatusError: null,
			};
		case UPDATE_STATES_STATUS_FAIL:
			return {
				...state,
				updateStatesStatusLoading: false,
				updateStatesStatusError: payload,
				updateStatesStatus: false,
			};
		case UPDATE_STATES_STATUS_SUCCESS:
			return {
				...state,
				updateStatesStatusLoading: false,
				updateStatesStatus: true,
				updateStatesStatusError: false,
			};
		default:
			return { ...state };
	}
};

export default statesReducer;
