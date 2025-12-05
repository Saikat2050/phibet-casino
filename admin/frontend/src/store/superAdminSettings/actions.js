import {
	GET_SA_BANNERS,
	GET_SA_BANNERS_SUCCESS,
	GET_SA_BANNERS_FAIL,
	GET_DOCUMENT_LABEL,
	GET_DOCUMENT_LABEL_SUCCESS,
	GET_DOCUMENT_LABEL_FAIL,
	CREATE_KYC_LABELS_START,
	CREATE_KYC_LABELS_SUCCESS,
	CREATE_KYC_LABELS_FAIL,
	EDIT_KYC_LABELS_START,
	EDIT_KYC_LABELS_SUCCESS,
	EDIT_KYC_LABELS_FAIL,
	EDIT_SA_BANNERS_START,
	EDIT_SA_BANNERS_SUCCESS,
	EDIT_SA_BANNERS_FAIL,
	GET_LOYALTY_LEVEL,
	GET_LOYALTY_LEVEL_SUCCESS,
	GET_LOYALTY_LEVEL_FAIL,
	UPDATE_LOYALTY_LEVEL,
	UPDATE_LOYALTY_LEVEL_SUCCESS,
	UPDATE_LOYALTY_LEVEL_FAIL,
	RESET_DOCUMENT_LABELS,
	RESET_SA_BANNERS_DATA,
	RESET_LOYALTY_LEVEL_DATA,
	DELETE_SA_BANNERS_START,
	DELETE_SA_BANNERS_SUCCESS,
	DELETE_SA_BANNERS_FAIL,
} from './actionTypes';

export const getSABanners = (payload) => ({
	type: GET_SA_BANNERS,
	payload,
});

export const getSABannersSuccess = (payload) => ({
	type: GET_SA_BANNERS_SUCCESS,
	payload,
});

export const getSABannersFail = (payload) => ({
	type: GET_SA_BANNERS_FAIL,
	payload,
});

export const resetSABannersData = (payload) => ({
	type: RESET_SA_BANNERS_DATA,
	payload,
});

export const getDocumentLabel = (payload) => ({
	type: GET_DOCUMENT_LABEL,
	payload,
});

export const getDocumentLabelSuccess = (payload) => ({
	type: GET_DOCUMENT_LABEL_SUCCESS,
	payload,
});

export const getDocumentLabelFail = (payload) => ({
	type: GET_DOCUMENT_LABEL_FAIL,
	payload,
});

export const resetDocumentLabels = (payload) => ({
	type: RESET_DOCUMENT_LABELS,
	payload,
});

export const createKYCLabelsStart = (payload) => ({
	type: CREATE_KYC_LABELS_START,
	payload,
});

export const createKYCLabelsSuccess = (payload) => ({
	type: CREATE_KYC_LABELS_SUCCESS,
	payload,
});

export const createKYCLabelsFail = (payload) => ({
	type: CREATE_KYC_LABELS_FAIL,
	payload,
});

export const editKYCLabelsStart = (payload) => ({
	type: EDIT_KYC_LABELS_START,
	payload,
});

export const editKYCLabelsSuccess = (payload) => ({
	type: EDIT_KYC_LABELS_SUCCESS,
	payload,
});

export const editKYCLabelsFail = (payload) => ({
	type: EDIT_KYC_LABELS_FAIL,
	payload,
});

export const deleteSABannersStart = (payload) => ({
	type: DELETE_SA_BANNERS_START,
	payload,
});

export const deleteSABannersSuccess = (payload) => ({
	type: DELETE_SA_BANNERS_SUCCESS,
	payload,
});

export const deleteSABannersFail = (payload) => ({
	type: DELETE_SA_BANNERS_FAIL,
	payload,
});

export const editSABannersStart = (payload) => ({
	type: EDIT_SA_BANNERS_START,
	payload,
});

export const editSABannersSuccess = (payload) => ({
	type: EDIT_SA_BANNERS_SUCCESS,
	payload,
});

export const editSABannersFail = (payload) => ({
	type: EDIT_SA_BANNERS_FAIL,
	payload,
});

export const getLoyaltyLevel = (payload) => ({
	type: GET_LOYALTY_LEVEL,
	payload,
});

export const getLoyaltyLevelSuccess = (payload) => ({
	type: GET_LOYALTY_LEVEL_SUCCESS,
	payload,
});

export const getLoyaltyLevelFail = (payload) => ({
	type: GET_LOYALTY_LEVEL_FAIL,
	payload,
});

export const resetLoyaltyLevelData = (payload) => ({
	type: RESET_LOYALTY_LEVEL_DATA,
	payload,
});

export const updateLoyaltyLevel = (payload) => ({
	type: UPDATE_LOYALTY_LEVEL,
	payload,
});

export const updateLoyaltyLevelSuccess = (payload) => ({
	type: UPDATE_LOYALTY_LEVEL_SUCCESS,
	payload,
});

export const updateLoyaltyLevelFail = (payload) => ({
	type: UPDATE_LOYALTY_LEVEL_FAIL,
	payload,
});
