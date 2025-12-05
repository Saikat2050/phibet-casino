import {
	FETCH_GAME_TRANSACTIONS_FAIL,
	FETCH_GAME_TRANSACTIONS_START,
	FETCH_GAME_TRANSACTIONS_SUCCESS,
	RESET_GAME_TRANSACTIONS_DATA,
} from './actionTypes';

const initialState = {
	gameTransactions: null,
	error: '',
	loading: false,
};

const gameTransactionsReducer = (
	state = initialState,
	{ type, payload } = {}
) => {
	switch (type) {
		case FETCH_GAME_TRANSACTIONS_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_GAME_TRANSACTIONS_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_GAME_TRANSACTIONS_SUCCESS:
			return {
				...state,
				loading: false,
				gameTransactions: payload,
			};
		case RESET_GAME_TRANSACTIONS_DATA:
			return {
				...state,
				loading: false,
				gameTransactions: null,
				error: '',
			};
		default:
			return { ...state };
	}
};

export default gameTransactionsReducer;
