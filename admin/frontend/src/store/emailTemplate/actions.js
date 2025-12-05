import {
	GET_ALL_EMAIL_TEMPLATES,
	GET_ALL_EMAIL_TEMPLATES_SUCCESS,
	GET_ALL_EMAIL_TEMPLATES_FAIL,
	GET_IMAGE_GALLERY,
	GET_IMAGE_GALLERY_SUCCESS,
	GET_IMAGE_GALLERY_FAIL,
	UPLOAD_IMAGE_GALLERY,
	UPLOAD_IMAGE_GALLERY_SUCCESS,
	UPLOAD_IMAGE_GALLERY_FAIL,
	DELETE_IMAGE_GALLERY,
	DELETE_IMAGE_GALLERY_SUCCESS,
	DELETE_IMAGE_GALLERY_FAIL,
	GET_DYNAMIC_KEYS,
	GET_DYNAMIC_KEYS_SUCCESS,
	GET_DYNAMIC_KEYS_FAIL,
	GET_EMAIL_TYPES,
	GET_EMAIL_TYPES_SUCCESS,
	GET_EMAIL_TYPES_FAIL,
	RESET_EMAIL_TEMPLATES,
	TEST_EMAIL_TEMPLATE_SUCCESS,
	TEST_EMAIL_TEMPLATE_FAIL,
	TEST_EMAIL_TEMPLATE,
	CREATE_EMAIL_TEMPLATE_SUCCESS,
	CREATE_EMAIL_TEMPLATE_FAIL,
	CREATE_EMAIL_TEMPLATE,
	GET_EMAIL_TEMPLATE,
	GET_EMAIL_TEMPLATE_SUCCESS,
	GET_EMAIL_TEMPLATE_FAIL,
	UPDATE_EMAIL_TEMPLATE,
	UPDATE_EMAIL_TEMPLATE_SUCCESS,
	UPDATE_EMAIL_TEMPLATE_FAIL,
	DELETE_EMAIL_TEMPLATE,
	DELETE_EMAIL_TEMPLATE_SUCCESS,
	DELETE_EMAIL_TEMPLATE_FAIL,
	MAKE_EMAIL_TEMPLATE_PRIMARY_SUCCESS,
	MAKE_EMAIL_TEMPLATE_PRIMARY_FAIL,
	MAKE_EMAIL_TEMPLATE_PRIMARY,
	RESET_ALL_EMAIL_TEMPLATES,
	RESET_IMAGE_GALLERY,
} from './actionTypes';

export const getAllEmailTemplatesSuccess = (payload) => ({
	type: GET_ALL_EMAIL_TEMPLATES_SUCCESS,
	payload,
});

export const getAllEmailTemplatesFail = (payload) => ({
	type: GET_ALL_EMAIL_TEMPLATES_FAIL,
	payload,
});

export const getAllEmailTemplates = (payload) => ({
	type: GET_ALL_EMAIL_TEMPLATES,
	payload,
});

export const resetAllEmailTemplates = (payload) => ({
	type: RESET_ALL_EMAIL_TEMPLATES,
	payload,
});

export const getImageGallerySuccess = (payload) => ({
	type: GET_IMAGE_GALLERY_SUCCESS,
	payload,
});

export const getImageGalleryFail = (payload) => ({
	type: GET_IMAGE_GALLERY_FAIL,
	payload,
});

export const getImageGallery = (payload) => ({
	type: GET_IMAGE_GALLERY,
	payload,
});

export const resetImageGallery = (payload) => ({
	type: RESET_IMAGE_GALLERY,
	payload,
});

export const uploadImageGallerySuccess = (payload) => ({
	type: UPLOAD_IMAGE_GALLERY_SUCCESS,
	payload,
});

export const uploadImageGalleryFail = (payload) => ({
	type: UPLOAD_IMAGE_GALLERY_FAIL,
	payload,
});

export const uploadImageGallery = (payload) => ({
	type: UPLOAD_IMAGE_GALLERY,
	payload,
});

export const deleteImageGallerySuccess = (payload) => ({
	type: DELETE_IMAGE_GALLERY_SUCCESS,
	payload,
});

export const deleteImageGalleryFail = (payload) => ({
	type: DELETE_IMAGE_GALLERY_FAIL,
	payload,
});

export const deleteImageGallery = (payload) => ({
	type: DELETE_IMAGE_GALLERY,
	payload,
});

export const getDynamicKeysSuccess = (payload) => ({
	type: GET_DYNAMIC_KEYS_SUCCESS,
	payload,
});

export const getDynamicKeysFail = (payload) => ({
	type: GET_DYNAMIC_KEYS_FAIL,
	payload,
});

export const getDynamicKeys = (payload) => ({
	type: GET_DYNAMIC_KEYS,
	payload,
});

export const getEmailTypesSuccess = (payload) => ({
	type: GET_EMAIL_TYPES_SUCCESS,
	payload,
});

export const getEmailTypesFail = (payload) => ({
	type: GET_EMAIL_TYPES_FAIL,
	payload,
});

export const getEmailTypes = (payload) => ({
	type: GET_EMAIL_TYPES,
	payload,
});

export const resetEmailTemplate = (payload) => ({
	type: RESET_EMAIL_TEMPLATES,
	payload,
});

export const testEmailTemplateSuccess = (payload) => ({
	type: TEST_EMAIL_TEMPLATE_SUCCESS,
	payload,
});

export const testEmailTemplateFail = (payload) => ({
	type: TEST_EMAIL_TEMPLATE_FAIL,
	payload,
});

export const testEmailTemplate = (payload) => ({
	type: TEST_EMAIL_TEMPLATE,
	payload,
});

export const createEmailTemplateSuccess = (payload) => ({
	type: CREATE_EMAIL_TEMPLATE_SUCCESS,
	payload,
});

export const createEmailTemplateFail = (payload) => ({
	type: CREATE_EMAIL_TEMPLATE_FAIL,
	payload,
});

export const createEmailTemplate = (payload) => ({
	type: CREATE_EMAIL_TEMPLATE,
	payload,
});

export const getEmailTemplateSuccess = (payload) => ({
	type: GET_EMAIL_TEMPLATE_SUCCESS,
	payload,
});

export const getEmailTemplateFail = (payload) => ({
	type: GET_EMAIL_TEMPLATE_FAIL,
	payload,
});

export const getEmailTemplate = (payload) => ({
	type: GET_EMAIL_TEMPLATE,
	payload,
});

export const updateEmailTemplateSuccess = (payload) => ({
	type: UPDATE_EMAIL_TEMPLATE_SUCCESS,
	payload,
});

export const updateEmailTemplateFail = (payload) => ({
	type: UPDATE_EMAIL_TEMPLATE_FAIL,
	payload,
});

export const updateEmailTemplate = (payload) => ({
	type: UPDATE_EMAIL_TEMPLATE,
	payload,
});

export const deleteEmailTemplateSuccess = (payload) => ({
	type: DELETE_EMAIL_TEMPLATE_SUCCESS,
	payload,
});

export const deleteEmailTemplateFail = (payload) => ({
	type: DELETE_EMAIL_TEMPLATE_FAIL,
	payload,
});

export const deleteEmailTemplate = (payload) => ({
	type: DELETE_EMAIL_TEMPLATE,
	payload,
});

export const makeEmailTemplatePrimarySuccess = (payload) => ({
	type: MAKE_EMAIL_TEMPLATE_PRIMARY_SUCCESS,
	payload,
});

export const makeEmailTemplatePrimaryFail = (payload) => ({
	type: MAKE_EMAIL_TEMPLATE_PRIMARY_FAIL,
	payload,
});

export const makeEmailTemplatePrimary = (payload) => ({
	type: MAKE_EMAIL_TEMPLATE_PRIMARY,
	payload,
});
