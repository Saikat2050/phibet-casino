import {
	GET_CHATRAIN_DATA,
	GET_CHATRAIN_DATA_SUCCESS,
	GET_CHATRAIN_DATA_FAIL,
	CREATE_CHATRAIN_SUCCESS,
	CREATE_CHATRAIN_FAIL,
	CREATE_CHATRAIN,
	RESET_CHATRAIN,
	UPDATE_CHATRAIN_SUCCESS,
	UPDATE_CHATRAIN_FAIL,
	UPDATE_CHATRAIN,
} from './actionTypes';

export const getChatrainSuccess = (payload) => ({
	type: GET_CHATRAIN_DATA_SUCCESS,
	payload,
});

export const getChatrainFail = (payload) => ({
	type: GET_CHATRAIN_DATA_FAIL,
	payload,
});

export const getChatrain = (payload) => ({
	type: GET_CHATRAIN_DATA,
	payload,
});

export const createChatrainSuccess = (payload) => ({
	type: CREATE_CHATRAIN_SUCCESS,
	payload,
});

export const createChatrainFail = (payload) => ({
	type: CREATE_CHATRAIN_FAIL,
	payload,
});

export const createChatrain = (payload) => ({
	type: CREATE_CHATRAIN,
	payload,
});

export const updateChatrainSuccess = (payload) => ({
	type: UPDATE_CHATRAIN_SUCCESS,
	payload,
});

export const updateChatrainFail = (payload) => ({
	type: UPDATE_CHATRAIN_FAIL,
	payload,
});

export const updateChatrain = (payload) => ({
	type: UPDATE_CHATRAIN,
	payload,
});

export const resetChatrain = (payload) => ({
	type: RESET_CHATRAIN,
	payload,
});
