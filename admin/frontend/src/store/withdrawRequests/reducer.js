import {
	APPROVE_REJECT_WITHDRAW_REQUESTS_FAIL,
	APPROVE_REJECT_WITHDRAW_REQUESTS_START,
	APPROVE_REJECT_WITHDRAW_REQUESTS_SUCCESS,
	FETCH_WITHDRAW_REQUESTS_FAIL,
	FETCH_WITHDRAW_REQUESTS_START,
	FETCH_WITHDRAW_REQUESTS_SUCCESS,
	RESET_WITHDRAW_REQUESTS_DATA,
} from './actionTypes';

const initialState = {
	withdrawRequests: null,
	approveRejectWithdrawRequest: null,
	error: '',
	loading: false,
	approveRejectLoading: false,
};

const withdrawRequestsReducer = (
	state = initialState,
	{ type, payload } = {}
) => {
	switch (type) {
		case FETCH_WITHDRAW_REQUESTS_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_WITHDRAW_REQUESTS_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_WITHDRAW_REQUESTS_SUCCESS:
			return {
				...state,
				loading: false,
				withdrawRequests: payload,
			};
		case RESET_WITHDRAW_REQUESTS_DATA:
			return {
				...state,
				loading: false,
				withdrawRequests: null,
				error: '',
			};
		case APPROVE_REJECT_WITHDRAW_REQUESTS_START:
			return {
				...state,
				approveRejectLoading: true,
			};
		case APPROVE_REJECT_WITHDRAW_REQUESTS_FAIL:
			return {
				...state,
				approveRejectLoading: false,
				error: true,
			};
		case APPROVE_REJECT_WITHDRAW_REQUESTS_SUCCESS:
			return {
				...state,
				approveRejectLoading: false,
				approveRejectWithdrawRequest: payload,
			};
		default:
			return { ...state };
	}
};

export default withdrawRequestsReducer;
