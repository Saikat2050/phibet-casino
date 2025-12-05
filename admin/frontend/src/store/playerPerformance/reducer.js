import {
	FETCH_PLAYER_PERFORMANCE_FAIL,
	FETCH_PLAYER_PERFORMANCE_START,
	FETCH_PLAYER_PERFORMANCE_SUCCESS,
} from './actionTypes';

const initialState = {
	playerPerformance: null,
	error: '',
	loading: false,
};

const playerPerformanceReducer = (
	state = initialState,
	{ type, payload } = {}
) => {
	switch (type) {
		case FETCH_PLAYER_PERFORMANCE_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_PLAYER_PERFORMANCE_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_PLAYER_PERFORMANCE_SUCCESS:
			return {
				...state,
				loading: false,
				playerPerformance: payload,
			};
		default:
			return { ...state };
	}
};

export default playerPerformanceReducer;
