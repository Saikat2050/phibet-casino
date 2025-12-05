import {
	FETCH_TRANSACTION_BANKING_FAIL,
	FETCH_TRANSACTION_BANKING_START,
	FETCH_TRANSACTION_BANKING_SUCCESS,
	GET_LEDGER_DETAILS_FAIL,
	GET_LEDGER_DETAILS_START,
	GET_LEDGER_DETAILS_SUCCESS,
	RESET_TRANSACTION_BANKING_DATA,
} from './actionTypes';

const initialState = {
	transactionBanking: null,
	error: '',
	loading: false,
	ledgerDetailLoading: false,
	ledgerDetail: null,
	ledgerDetailError: null,
};

const transactionBankingReducer = (
	state = initialState,
	{ type, payload } = {}
) => {
	switch (type) {
		case FETCH_TRANSACTION_BANKING_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_TRANSACTION_BANKING_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_TRANSACTION_BANKING_SUCCESS:
			return {
				...state,
				loading: false,
				transactionBanking: payload,
			};
		case GET_LEDGER_DETAILS_START:
			return {
				...state,
				ledgerDetailLoading: true,
				ledgerDetail: null,
				ledgerDetailError: null,
			};
		case GET_LEDGER_DETAILS_SUCCESS:
			return {
				...state,
				ledgerDetailLoading: false,
				ledgerDetail: payload,
				ledgerDetailError: null,
			};
		case GET_LEDGER_DETAILS_FAIL:
			return {
				...state,
				ledgerDetailLoading: false,
				ledgerDetail: null,
				ledgerDetailError: payload,
			};
		case RESET_TRANSACTION_BANKING_DATA:
			return {
				...state,
				loading: false,
				error: '',
				transactionBanking: null,
			};
		default:
			return state;
	}
};

export default transactionBankingReducer;
