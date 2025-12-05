import {
	FETCH_SPORTS_TRANSACTIONS_FAIL,
	FETCH_SPORTS_TRANSACTIONS_START,
	FETCH_SPORTS_TRANSACTIONS_SUCCESS,
	RESET_SPORTS_TRANSACTIONS_DATA,
} from './actionTypes';

const initialState = {
	sportsTransactions: null,
	error: '',
	loading: false,
};

const sportsTransactionsReducer = (
	state = initialState,
	{ type, payload } = {}
) => {
	switch (type) {
		case FETCH_SPORTS_TRANSACTIONS_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_SPORTS_TRANSACTIONS_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_SPORTS_TRANSACTIONS_SUCCESS:
			return {
				...state,
				loading: false,
				sportsTransactions: payload,
			};
		case RESET_SPORTS_TRANSACTIONS_DATA:
			return {
				...state,
				loading: false,
				sportsTransactions: null,
				error: '',
			};
		default:
			return { ...state };
	}
};

export default sportsTransactionsReducer;
