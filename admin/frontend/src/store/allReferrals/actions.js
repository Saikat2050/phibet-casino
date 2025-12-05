import {
	FETCH_ALL_REFERRALS_FAIL,
	FETCH_ALL_REFERRALS_START,
	FETCH_ALL_REFERRALS_SUCCESS,
	EDIT_ALL_REFERRALS_SUCCESS,
	EDIT_ALL_REFERRALS_FAIL,
	EDIT_ALL_REFERRALS_START,
	RESET_ALL_REFERRALS_DATA,
} from './actionTypes';

export const fetchAllReferralsStart = (payload) => ({
	type: FETCH_ALL_REFERRALS_START,
	payload,
});

export const fetchAllReferralsSuccess = (payload) => ({
	type: FETCH_ALL_REFERRALS_SUCCESS,
	payload,
});

export const fetchAllReferralsFail = (history) => ({
	type: FETCH_ALL_REFERRALS_FAIL,
	payload: { history },
});

export const resetAllReferralsData = (history) => ({
	type: RESET_ALL_REFERRALS_DATA,
	payload: { history },
});

export const editReferralSuccess = (payload) => ({
	type: EDIT_ALL_REFERRALS_SUCCESS,
	payload,
});

export const editReferralFail = (payload) => ({
	type: EDIT_ALL_REFERRALS_FAIL,
	payload,
});

export const editReferralStart = (payload) => ({
	type: EDIT_ALL_REFERRALS_START,
	payload,
});
