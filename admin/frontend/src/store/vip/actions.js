import {
	CREATE_VIP_TIER_FAIL,
	CREATE_VIP_TIER_START,
	CREATE_VIP_TIER_SUCCESS,
	EDIT_VIP_TIER_FAIL,
	EDIT_VIP_TIER_START,
	EDIT_VIP_TIER_SUCCESS,
	GET_VIP_TIER_FAIL,
	GET_VIP_TIER_START,
	GET_VIP_TIER_SUCCESS,
	GET_VIP_TIER_BY_ID_START,
	GET_VIP_TIER_BY_ID_SUCCESS,
	GET_VIP_TIER_BY_ID_FAIL,
} from './actionTypes';

export const getVIPTierStart = (payload) => ({
	type: GET_VIP_TIER_START,
	payload,
});

export const getVIPTierSuccess = (payload) => ({
	type: GET_VIP_TIER_SUCCESS,
	payload,
});

export const getVIPTierFail = (payload) => ({
	type: GET_VIP_TIER_FAIL,
	payload,
});

export const editVIPTierStart = (payload) => ({
	type: EDIT_VIP_TIER_START,
	payload,
});

export const editVIPTierSuccess = (payload) => ({
	type: EDIT_VIP_TIER_SUCCESS,
	payload,
});

export const editVIPTierFail = (payload) => ({
	type: EDIT_VIP_TIER_FAIL,
	payload,
});

export const createVipTierStart = (payload) => ({
	type: CREATE_VIP_TIER_START,
	payload,
});

export const createVipTierSuccess = (payload) => ({
	type: CREATE_VIP_TIER_SUCCESS,
	payload,
});

export const createVipTierFail = (payload) => ({
	type: CREATE_VIP_TIER_FAIL,
	payload,
});

export const getVIPTierByIdStart = (payload) => ({
	type: GET_VIP_TIER_BY_ID_START,
	payload,
});

export const getVIPTierByIdSuccess = (data) => ({
	type: GET_VIP_TIER_BY_ID_SUCCESS,
	payload: data,
});

export const getVIPTierByIdFail = (error) => ({
	type: GET_VIP_TIER_BY_ID_FAIL,
	payload: error,
});
