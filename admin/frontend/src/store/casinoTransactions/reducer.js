import {
	FETCH_CASINO_TRANSACTIONS_FAIL,
	FETCH_CASINO_TRANSACTIONS_START,
	FETCH_CASINO_TRANSACTIONS_SUCCESS,
	RESET_CASINO_TRANSACTIONS_DATA,
} from './actionTypes';

const initialState = {
	casinoTransactions: null,
	error: '',
	loading: false,
};

const casinoTransactionsReducer = (
	state = initialState,
	{ type, payload } = {}
) => {
	switch (type) {
		case FETCH_CASINO_TRANSACTIONS_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_CASINO_TRANSACTIONS_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_CASINO_TRANSACTIONS_SUCCESS:
			return {
				...state,
				loading: false,
				casinoTransactions: payload,
			};
		case RESET_CASINO_TRANSACTIONS_DATA:
			return {
				...state,
				loading: false,
				casinoTransactions: null,
				error: '',
			};
		default:
			return { ...state };
	}
};

export default casinoTransactionsReducer;
