import {
	FETCH_SPORTS_MARKETS_FAIL,
	FETCH_SPORTS_MARKETS_START,
	FETCH_SPORTS_MARKETS_SUCCESS,
	RESET_SPORTS_MARKETS_DATA,
} from './actionTypes';

const initialState = {
	sportsMarkets: null,
	error: '',
	loading: false,
};

const sportsMarketsReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case FETCH_SPORTS_MARKETS_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_SPORTS_MARKETS_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_SPORTS_MARKETS_SUCCESS:
			return {
				...state,
				loading: false,
				sportsMarkets: payload,
			};
		case RESET_SPORTS_MARKETS_DATA:
			return {
				...state,
				loading: false,
				sportsMarkets: null,
				error: '',
			};
		default:
			return { ...state };
	}
};

export default sportsMarketsReducer;
