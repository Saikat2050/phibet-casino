import {
	CREATE_BONUS,
	CREATE_BONUS_FAIL,
	CREATE_BONUS_SUCCESS,
	RESET_CREATE_BONUS,
	RESET_UPDATE_BONUS,
	UPDATE_BONUS,
	UPDATE_BONUS_FAIL,
	UPDATE_BONUS_SUCCESS,
} from './actionTypes';

export const createBonusSuccess = (payload) => ({
	type: CREATE_BONUS_SUCCESS,
	payload,
});

export const createBonusFail = (payload) => ({
	type: CREATE_BONUS_FAIL,
	payload,
});

export const createBonus = (payload) => ({
	type: CREATE_BONUS,
	payload,
});

export const resetCreateBonus = (payload) => ({
	type: RESET_CREATE_BONUS,
	payload,
});

export const updateBonusSuccess = (payload) => ({
	type: UPDATE_BONUS_SUCCESS,
	payload,
});

export const updateBonusFail = (payload) => ({
	type: UPDATE_BONUS_FAIL,
	payload,
});

export const updateBonus = (payload) => ({
	type: UPDATE_BONUS,
	payload,
});

export const resetUpdateBonus = (payload) => ({
	type: RESET_UPDATE_BONUS,
	payload,
});
