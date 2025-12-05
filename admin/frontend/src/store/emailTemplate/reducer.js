import { groupBy } from 'lodash';
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

const INIT_STATE = {
	emailTemplates: {},
	templatePages: 0,
	emailTemplateloading: false,
	emailTemplateError: null,
	imageGallery: [],
	imageGalleryloading: false,
	imageGalleryError: null,
	uploadGallery: false,
	uploadGalleryloading: false,
	uploadGalleryError: null,
	deleteGallery: false,
	deleteGalleryloading: false,
	deleteGalleryError: null,
	dynamicKeys: {},
	dynamicKeysLoading: false,
	dynamicKeysError: null,
	emailTypes: null,
	emailTypesLoading: false,
	emailTypesError: null,
	testEmailTemplate: false,
	testEmailTemplateLoading: false,
	testEmailTemplateError: null,
	createEmailTemplate: false,
	createEmailTemplateLoading: false,
	createEmailTemplateError: null,
	emailTemplate: null,
	isEmailTemplateLoading: false,
	isEmailTemplateError: null,
	updateEmailTemplate: false,
	updateEmailTemplateLoading: false,
	updateEmailTemplateError: null,
	deleteEmailTemplate: false,
	deleteEmailTemplateLoading: false,
	deleteEmailTemplateError: null,
	makeEmailTemplatePrimary: false,
	makeEmailTemplatePrimaryLoading: false,
	makeEmailTemplatePrimaryError: null,
};

const EmailTemplate = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_ALL_EMAIL_TEMPLATES:
			return {
				...state,
				emailTemplateloading: true,
			};

		case GET_ALL_EMAIL_TEMPLATES_SUCCESS:
			return {
				...state,
				emailTemplateloading: false,
				emailTemplates: groupBy(payload?.emailTemplates, 'eventType'),
				templatePages: payload?.totalPages,
			};

		case GET_ALL_EMAIL_TEMPLATES_FAIL:
			return {
				...state,
				emailTemplateloading: false,
				emailTemplateError: null,
			};

		case RESET_ALL_EMAIL_TEMPLATES:
			return {
				...state,
				emailTemplateloading: false,
				emailTemplates: {},
				templatePages: 0,
			};

		case GET_IMAGE_GALLERY:
			return {
				...state,
				imageGalleryloading: true,
			};

		case GET_IMAGE_GALLERY_SUCCESS:
			return {
				...state,
				imageGalleryloading: false,
				imageGallery: payload,
				imageGalleryError: null,
			};

		case GET_IMAGE_GALLERY_FAIL:
			return {
				...state,
				imageGalleryloading: false,
				imageGalleryError: payload,
			};

		case RESET_IMAGE_GALLERY:
			return {
				...state,
				imageGalleryloading: false,
				imageGallery: [],
				imageGalleryError: null,
			};

		case UPLOAD_IMAGE_GALLERY:
			return {
				...state,
				uploadGalleryloading: true,
				uploadGallery: false,
				uploadGalleryError: null,
			};

		case UPLOAD_IMAGE_GALLERY_SUCCESS:
			return {
				...state,
				uploadGalleryloading: false,
				uploadGallery: true,
				uploadGalleryError: null,
			};

		case UPLOAD_IMAGE_GALLERY_FAIL:
			return {
				...state,
				uploadGalleryloading: false,
				uploadGalleryError: payload,
				uploadGallery: false,
			};

		case DELETE_IMAGE_GALLERY:
			return {
				...state,
				deleteGalleryloading: true,
			};

		case DELETE_IMAGE_GALLERY_SUCCESS:
			return {
				...state,
				deleteGalleryloading: false,
				deleteGallery: true,
				deleteGalleryError: null,
			};

		case DELETE_IMAGE_GALLERY_FAIL:
			return {
				...state,
				deleteGalleryloading: false,
				deleteGalleryError: payload,
				deleteGallery: false,
			};

		case GET_DYNAMIC_KEYS:
			return {
				...state,
				dynamicKeysLoading: true,
			};

		case GET_DYNAMIC_KEYS_SUCCESS:
			return {
				...state,
				dynamicKeysLoading: false,
				dynamicKeys: payload,
			};

		case GET_DYNAMIC_KEYS_FAIL:
			return {
				...state,
				dynamicKeysLoading: false,
				dynamicKeysError: payload,
			};

		case GET_EMAIL_TYPES:
			return {
				...state,
				emailTypesLoading: true,
			};

		case GET_EMAIL_TYPES_SUCCESS:
			return {
				...state,
				emailTypesLoading: false,
				emailTypes: payload,
			};

		case GET_EMAIL_TYPES_FAIL:
			return {
				...state,
				emailTypesLoading: false,
				emailTypesError: payload,
			};

		case RESET_EMAIL_TEMPLATES:
			return {
				...state,
				keyLoading: false,
				emailTemplate: null,
			};

		case TEST_EMAIL_TEMPLATE:
			return {
				...state,
				testEmailTemplateLoading: true,
			};

		case TEST_EMAIL_TEMPLATE_SUCCESS:
			return {
				...state,
				testEmailTemplateLoading: false,
				testEmailTemplate: true,
			};

		case TEST_EMAIL_TEMPLATE_FAIL:
			return {
				...state,
				testEmailTemplateLoading: false,
				testEmailTemplateError: payload,
				testEmailTemplate: false,
			};

		case CREATE_EMAIL_TEMPLATE:
			return {
				...state,
				createEmailTemplateLoading: true,
			};

		case CREATE_EMAIL_TEMPLATE_SUCCESS:
			return {
				...state,
				createEmailTemplateLoading: false,
				createEmailTemplate: true,
			};

		case CREATE_EMAIL_TEMPLATE_FAIL:
			return {
				...state,
				createEmailTemplateLoading: false,
				createEmailTemplateError: payload,
				createEmailTemplate: false,
			};

		case GET_EMAIL_TEMPLATE:
			return {
				...state,
				isEmailTemplateLoading: true,
			};

		case GET_EMAIL_TEMPLATE_SUCCESS:
			return {
				...state,
				isEmailTemplateLoading: false,
				emailTemplate: payload,
			};

		case GET_EMAIL_TEMPLATE_FAIL:
			return {
				...state,
				isEmailTemplateLoading: false,
				emailTemplateError: payload,
			};

		case UPDATE_EMAIL_TEMPLATE:
			return {
				...state,
				updateEmailTemplateLoading: true,
			};

		case UPDATE_EMAIL_TEMPLATE_SUCCESS:
			return {
				...state,
				updateEmailTemplateLoading: false,
				updateEmailTemplate: true,
			};

		case UPDATE_EMAIL_TEMPLATE_FAIL:
			return {
				...state,
				updateEmailTemplateLoading: false,
				updateEmailTemplateError: payload,
				updateEmailTemplate: false,
			};

		case DELETE_EMAIL_TEMPLATE:
			return {
				...state,
				deleteEmailTemplateLoading: true,
			};

		case DELETE_EMAIL_TEMPLATE_SUCCESS:
			return {
				...state,
				deleteEmailTemplateLoading: false,
				deleteEmailTemplate: true,
			};

		case DELETE_EMAIL_TEMPLATE_FAIL:
			return {
				...state,
				deleteEmailTemplateLoading: false,
				deleteEmailTemplateError: payload,
				deleteEmailTemplate: false,
			};

		case MAKE_EMAIL_TEMPLATE_PRIMARY:
			return {
				...state,
				makeEmailTemplatePrimaryLoading: true,
			};

		case MAKE_EMAIL_TEMPLATE_PRIMARY_SUCCESS:
			return {
				...state,
				makeEmailTemplatePrimaryLoading: false,
				emailTemplates: payload,
				makeEmailTemplatePrimary: true,
			};

		case MAKE_EMAIL_TEMPLATE_PRIMARY_FAIL:
			return {
				...state,
				makeEmailTemplatePrimaryLoading: false,
				makeEmailTemplatePrimaryError: payload,
				makeEmailTemplatePrimary: false,
			};

		default:
			return { ...state };
	}
};

export default EmailTemplate;
