import {
	GET_WAGERING_TEMPLATE_DETAIL,
	GET_WAGERING_TEMPLATE_DETAIL_SUCCESS,
	GET_WAGERING_TEMPLATE_DETAIL_FAIL,
	GET_WAGERING_TEMPLATE_DETAILS,
	GET_WAGERING_TEMPLATE_DETAILS_SUCCESS,
	GET_ALL_WAGERING_TEMPLATE_DETAILS_FAIL,
	CREATE_WAGERING_TEMPLATE_DETAILS,
	CREATE_WAGERING_TEMPLATE_DETAILS_SUCCESS,
	CREATE_WAGERING_TEMPLATE_DETAILS_FAIL,
	EDIT_WAGERING_TEMPLATE_DETAILS,
	EDIT_WAGERING_TEMPLATE_DETAILS_SUCCESS,
	EDIT_WAGERING_TEMPLATE_DETAILS_FAIL,
	RESET_WAGERING_TEMPLATE_DETAIL,
	RESET_WAGERING_TEMPLATE_DETAIL_DATA,
} from './actionTypes';

export const getWageringTemplateDetailsSuccess = (payload) => ({
	type: GET_WAGERING_TEMPLATE_DETAILS_SUCCESS,
	payload,
});

export const getWageringTemplateDetailsFail = (payload) => ({
	type: GET_ALL_WAGERING_TEMPLATE_DETAILS_FAIL,
	payload,
});

export const getWageringTemplateDetails = (payload) => ({
	type: GET_WAGERING_TEMPLATE_DETAILS,
	payload,
});

export const getWageringTemplateDetailSuccess = (payload) => ({
	type: GET_WAGERING_TEMPLATE_DETAIL_SUCCESS,
	payload,
});

export const getWageringTemplateDetailFail = (payload) => ({
	type: GET_WAGERING_TEMPLATE_DETAIL_FAIL,
	payload,
});

export const resetWageringTemplateDetail = (payload) => ({
	type: RESET_WAGERING_TEMPLATE_DETAIL,
	payload,
});

export const getWageringTemplateDetail = (payload) => ({
	type: GET_WAGERING_TEMPLATE_DETAIL,
	payload,
});

export const resetWageringTemplateDetailData = (payload) => ({
	type: RESET_WAGERING_TEMPLATE_DETAIL_DATA,
	payload,
});

export const createWageringTemplateDetailsSuccess = (payload) => ({
	type: CREATE_WAGERING_TEMPLATE_DETAILS_SUCCESS,
	payload,
});

export const createWageringTemplateDetailsFail = (payload) => ({
	type: CREATE_WAGERING_TEMPLATE_DETAILS_FAIL,
	payload,
});

export const createWageringTemplateDetails = (payload) => ({
	type: CREATE_WAGERING_TEMPLATE_DETAILS,
	payload,
});

export const editWageringTemplateDetailsSuccess = (payload) => ({
	type: EDIT_WAGERING_TEMPLATE_DETAILS_SUCCESS,
	payload,
});

export const editWageringTemplateDetailsFail = (payload) => ({
	type: EDIT_WAGERING_TEMPLATE_DETAILS_FAIL,
	payload,
});

export const editWageringTemplateDetails = (payload) => ({
	type: EDIT_WAGERING_TEMPLATE_DETAILS,
	payload,
});
