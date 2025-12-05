import {
	APPROVE_REJECT_WITHDRAW_REQUESTS_FAIL,
	APPROVE_REJECT_WITHDRAW_REQUESTS_START,
	APPROVE_REJECT_WITHDRAW_REQUESTS_SUCCESS,
	FETCH_WITHDRAW_REQUESTS_FAIL,
	FETCH_WITHDRAW_REQUESTS_START,
	FETCH_WITHDRAW_REQUESTS_SUCCESS,
	RESET_WITHDRAW_REQUESTS_DATA,
} from './actionTypes';

export const fetchWithdrawRequestsStart = (payload) => ({
	type: FETCH_WITHDRAW_REQUESTS_START,
	payload,
});

export const fetchWithdrawRequestsSuccess = (payload) => ({
	type: FETCH_WITHDRAW_REQUESTS_SUCCESS,
	payload,
});

export const fetchWithdrawRequestsFail = (history) => ({
	type: FETCH_WITHDRAW_REQUESTS_FAIL,
	payload: { history },
});

export const resetWithdrawRequestsData = (payload) => ({
	type: RESET_WITHDRAW_REQUESTS_DATA,
	payload,
});

export const approveRejectWithdrawRequestsStart = (payload) => ({
	type: APPROVE_REJECT_WITHDRAW_REQUESTS_START,
	payload,
});

export const approveRejectWithdrawRequestsSuccess = (payload) => ({
	type: APPROVE_REJECT_WITHDRAW_REQUESTS_SUCCESS,
	payload,
});

export const approveRejectWithdrawRequestsFail = (history) => ({
	type: APPROVE_REJECT_WITHDRAW_REQUESTS_FAIL,
	payload: { history },
});
