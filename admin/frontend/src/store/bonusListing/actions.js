import {
	GET_BONUSES_START,
	GET_BONUSES_SUCCESS,
	GET_BONUSES_FAIL,
	UPDATE_SA_BONUS_STATUS,
	UPDATE_SA_BONUS_STATUS_SUCCESS,
	UPDATE_SA_BONUS_STATUS_FAIL,
	GET_BONUS_DETAIL,
	GET_BONUS_DETAIL_SUCCESS,
	GET_BONUS_DETAIL_FAIL,
	DELETE_BONUS_START,
	DELETE_BONUS_FAIL,
	DELETE_BONUS_COMPLETE,
	REORDER_BONUS_START,
	REORDER_BONUS_SUCCESS,
	REORDER_BONUS_FAIL,
	RESET_BONUS_DETAILS_DATA,
} from './actionTypes';

export const getBonusesSuccess = (payload) => ({
	type: GET_BONUSES_SUCCESS,
	payload,
});

export const getBonusesFail = (payload) => ({
	type: GET_BONUSES_FAIL,
	payload,
});

export const getBonusesStart = (payload) => ({
	type: GET_BONUSES_START,
	payload,
});

export const resetBonusDetails = (payload) => ({
	type: RESET_BONUS_DETAILS_DATA,
	payload,
});

export const updateSABonusStatusSuccess = (payload) => ({
	type: UPDATE_SA_BONUS_STATUS_SUCCESS,
	payload,
});

export const updateSABonusStatusFail = (payload) => ({
	type: UPDATE_SA_BONUS_STATUS_FAIL,
	payload,
});

export const updateSABonusStatus = (payload) => ({
	type: UPDATE_SA_BONUS_STATUS,
	payload,
});

export const getBonusDetail = (payload) => ({
	type: GET_BONUS_DETAIL,
	payload,
});
export const getBonusDetailSuccess = (payload) => ({
	type: GET_BONUS_DETAIL_SUCCESS,
	payload,
});
export const getBonusDetailFail = (payload) => ({
	type: GET_BONUS_DETAIL_FAIL,
	payload,
});

export const deleteBonusStart = (payload) => ({
	type: DELETE_BONUS_START,
	payload,
});
export const deleteBonusComplete = (payload) => ({
	type: DELETE_BONUS_COMPLETE,
	payload,
});
export const deleteBonusFailure = (payload) => ({
	type: DELETE_BONUS_FAIL,
	payload,
});

export const reorderBonusStart = (payload) => ({
	type: REORDER_BONUS_START,
	payload,
});

export const reorderBonusSuccess = (payload) => ({
	type: REORDER_BONUS_SUCCESS,
	payload,
});

export const reorderBonusFailure = (payload) => ({
	type: REORDER_BONUS_FAIL,
	payload,
});
