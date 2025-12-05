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
	DELETE_CMS,
	DELETE_CMS_FAIL,
	DELETE_CMS_SUCCESS,
} from './actionTypes';

const INIT_STATE = {
	cmsDetails: null,
	error: null,
	isLoading: true,
	updateSACmsStatus: false,
	updateSACmsStatusError: null,
	updateSACmsStatusLoading: false,
	cmsDynamicKeys: null,
	cmsDynamicKeysError: null,
	cmsDynamicKeysLoading: false,
	isCreateCms: false,
	createCmsLoading: false,
	createCmsError: null,
	cmsByPageId: null,
	cmsByPageIdLoading: false,
	cmsByPageIdError: null,
	updateCms: false,
	updateCmsLoading: false,
	updateCmsError: null,
	isDeleteCmsLoading: false,
};

const getAllCms = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_ALL_CMS_DATA:
			return {
				...state,
				isLoading: false,
			};

		case GET_ALL_CMS_DATA_SUCCESS:
			return {
				...state,
				isLoading: true,
				cmsDetails: payload,
				error: null,
			};

		case GET_ALL_CMS_DATA_FAIL:
			return {
				...state,
				error: payload,
				isLoading: true,
			};

		case RESET_ALL_CMS_DATA:
			return {
				...state,
				cmsDetails: null,
				error: null,
				isLoading: true,
			};

		case UPDATE_SA_CMS_STATUS:
			return {
				...state,
				updateSACmsStatusLoading: true,
			};

		case UPDATE_SA_CMS_STATUS_FAIL:
			return {
				...state,
				updateSACmsStatusLoading: false,
				updateSACmsStatusError: payload,
				updateSACmsStatus: false,
			};

		case UPDATE_SA_CMS_STATUS_SUCCESS:
			return {
				...state,
				updateSACmsStatusLoading: false,
				updateSACmsStatus: true,
				updateSACmsStatusError: false,
			};

		case GET_CMS_DYNAMIC_KEYS:
			return {
				...state,
				cmsDynamicKeysLoading: true,
			};

		case GET_CMS_DYNAMIC_KEYS_FAIL:
			return {
				...state,
				cmsDynamicKeysLoading: false,
				cmsDynamicKeysError: payload,
				cmsDynamicKeys: null,
			};

		case GET_CMS_DYNAMIC_KEYS_SUCCESS:
			return {
				...state,
				cmsDynamicKeysLoading: false,
				cmsDynamicKeys: payload,
				cmsDynamicKeysError: null,
			};

		case CREATE_SA_CMS:
			return {
				...state,
				createCmsLoading: true,
			};

		case CREATE_SA_CMS_FAIL:
			return {
				...state,
				createCmsLoading: false,
				createCmsError: payload,
				isCreateCmspd: false,
			};

		case CREATE_SA_CMS_SUCCESS:
			return {
				...state,
				createCmsLoading: false,
				isCreateCms: true,
				createCmsError: null,
			};

		case GET_CMS_BY_PAGE_ID:
			return {
				...state,
				cmsByPageIdLoading: true,
			};

		case GET_CMS_BY_PAGE_ID_FAIL:
			return {
				...state,
				cmsByPageIdLoading: false,
				cmsByPageIdError: payload,
				cmsByPageId: null,
			};

		case GET_CMS_BY_PAGE_ID_SUCCESS:
			return {
				...state,
				cmsByPageIdLoading: false,
				cmsByPageId: payload,
				cmsByPageIdError: null,
			};

		case RESET_CMS_BY_PAGE_ID:
			return {
				...state,
				cmsByPageIdLoading: false,
				cmsByPageId: null,
				cmsByPageIdError: null,
			};

		case UPDATE_SA_CMS:
			return {
				...state,
				updateCmsLoading: true,
			};

		case UPDATE_SA_CMS_FAIL:
			return {
				...state,
				updateCmsLoading: false,
				updateCmsError: payload,
				updateCms: false,
			};

		case UPDATE_SA_CMS_SUCCESS:
			return {
				...state,
				updateCmsLoading: false,
				updateCms: true,
				updateCmsError: null,
			};

		case DELETE_CMS:
			return {
				...state,
				isDeleteCmsLoading: true,
			};

		case DELETE_CMS_FAIL:
		case DELETE_CMS_SUCCESS:
			return {
				...state,
				isDeleteCmsLoading: false,
			};

		default:
			return { ...state };
	}
};

export default getAllCms;
