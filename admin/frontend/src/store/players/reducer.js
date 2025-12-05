import {
	FETCH_PLAYERS_FAIL,
	FETCH_PLAYERS_START,
	FETCH_PLAYERS_SUCCESS,
	RESET_PLAYERS_DATA,
} from './actionTypes';

const initialState = {
	players: null,
	error: '',
	loading: false,
};

const playersReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case FETCH_PLAYERS_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_PLAYERS_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_PLAYERS_SUCCESS:
			return {
				...state,
				loading: false,
				players: payload,
			};
		case RESET_PLAYERS_DATA:
			return {
				...state,
				loading: false,
				players: null,
				error: '',
			};
		default:
			return { ...state };
	}
};

export default playersReducer;
