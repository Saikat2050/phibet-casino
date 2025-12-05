import {
	FETCH_SPORTS_BET_FAIL,
	FETCH_SPORTS_BET_START,
	FETCH_SPORTS_BET_SUCCESS,
	RESET_SPORTS_BET_DATA,
} from './actionTypes';

const initialState = {
	sportsBet: null,
	error: '',
	loading: false,
};

const sportsTransactionReducer = (
	state = initialState,
	{ type, payload } = {}
) => {
	switch (type) {
		case FETCH_SPORTS_BET_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_SPORTS_BET_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_SPORTS_BET_SUCCESS:
			return {
				...state,
				loading: false,
				sportsBet: payload,
			};
		case RESET_SPORTS_BET_DATA:
			return {
				...state,
				loading: false,
				sportsBet: null,
				error: '',
			};
		default:
			return { ...state };
	}
};

export default sportsTransactionReducer;
