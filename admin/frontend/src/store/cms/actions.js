import {
	GET_ALL_CMS_DATA,
	GET_ALL_CMS_DATA_SUCCESS,
	GET_ALL_CMS_DATA_FAIL,
	UPDATE_SA_CMS_STATUS,
	UPDATE_SA_CMS_STATUS_SUCCESS,
	UPDATE_SA_CMS_STATUS_FAIL,
	GET_CMS_DYNAMIC_KEYS,
	GET_CMS_DYNAMIC_KEYS_SUCCESS,
	GET_CMS_DYNAMIC_KEYS_FAIL,
	CREATE_SA_CMS,
	CREATE_SA_CMS_SUCCESS,
	CREATE_SA_CMS_FAIL,
	GET_CMS_BY_PAGE_ID,
	GET_CMS_BY_PAGE_ID_SUCCESS,
	GET_CMS_BY_PAGE_ID_FAIL,
	UPDATE_SA_CMS,
	UPDATE_SA_CMS_SUCCESS,
	UPDATE_SA_CMS_FAIL,
	RESET_ALL_CMS_DATA,
	RESET_CMS_BY_PAGE_ID,
	DELETE_CMS_SUCCESS,
	DELETE_CMS_FAIL,
	DELETE_CMS,
} from './actionTypes';

export const getAllCmsDetailsSuccess = (payload) => ({
	type: GET_ALL_CMS_DATA_SUCCESS,
	payload,
});

export const getAllCmsDetailsFail = (payload) => ({
	type: GET_ALL_CMS_DATA_FAIL,
	payload,
});

export const getAllCmsDetails = (payload) => ({
	type: GET_ALL_CMS_DATA,
	payload,
});

export const resetAllCmsDetails = (payload) => ({
	type: RESET_ALL_CMS_DATA,
	payload,
});

export const updateSaCmsStatusSuccess = (payload) => ({
	type: UPDATE_SA_CMS_STATUS_SUCCESS,
	payload,
});

export const updateSaCmsStatusFail = (payload) => ({
	type: UPDATE_SA_CMS_STATUS_FAIL,
	payload,
});

export const updateSaCmsStatus = (payload) => ({
	type: UPDATE_SA_CMS_STATUS,
	payload,
});

export const getCmsDynamicKeysSuccess = (payload) => ({
	type: GET_CMS_DYNAMIC_KEYS_SUCCESS,
	payload,
});

export const getCmsDynamicKeysFail = (payload) => ({
	type: GET_CMS_DYNAMIC_KEYS_FAIL,
	payload,
});

export const getCmsDynamicKeys = (payload) => ({
	type: GET_CMS_DYNAMIC_KEYS,
	payload,
});

export const createSaCmsSuccess = (payload) => ({
	type: CREATE_SA_CMS_SUCCESS,
	payload,
});

export const createSaCmsFail = (payload) => ({
	type: CREATE_SA_CMS_FAIL,
	payload,
});

export const createSaCms = (payload) => ({
	type: CREATE_SA_CMS,
	payload,
});

export const getCmsByPageIdSuccess = (payload) => ({
	type: GET_CMS_BY_PAGE_ID_SUCCESS,
	payload,
});

export const getCmsByPageIdFail = (payload) => ({
	type: GET_CMS_BY_PAGE_ID_FAIL,
	payload,
});

export const getCmsByPageId = (payload) => ({
	type: GET_CMS_BY_PAGE_ID,
	payload,
});

export const resetCmsByPageIdData = (payload) => ({
	type: RESET_CMS_BY_PAGE_ID,
	payload,
});

export const updateSaCmsSuccess = (payload) => ({
	type: UPDATE_SA_CMS_SUCCESS,
	payload,
});

export const updateSaCmsFail = (payload) => ({
	type: UPDATE_SA_CMS_FAIL,
	payload,
});

export const updateSaCms = (payload) => ({
	type: UPDATE_SA_CMS,
	payload,
});

export const deleteCmsSuccess = (payload) => ({
	type: DELETE_CMS_SUCCESS,
	payload,
});

export const deleteCmsFail = (payload) => ({
	type: DELETE_CMS_FAIL,
	payload,
});

export const deleteCms = (payload) => ({
	type: DELETE_CMS,
	payload,
});
