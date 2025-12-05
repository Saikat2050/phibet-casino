import {
	GET_ALL_GROUP_START,
	GET_ALL_GROUP_SUCCESS,
	GET_ALL_GROUP_FAIL,
	UPDATE_SUPER_ADMIN_STATUS_START,
	UPDATE_SUPER_ADMIN_STATUS_SUCCESS,
	UPDATE_SUPER_ADMIN_STATUS_FAIL,
} from './actionTypes';

const INIT_STATE = {
	isLoading: false,
	error: null,
	// adminUsers: [],
	// adminUserDetails: {},
	groups: [],
	superAdminStatus: false,
	superAdminStatusError: null,
	superAdminStatusLoading: false,
};

const adminUser = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_ALL_GROUP_START:
			return {
				...state,
				isLoading: false,
			};

		case GET_ALL_GROUP_SUCCESS:
			return {
				...state,
				isLoading: true,
				groups: payload,
				error: null,
			};

		case GET_ALL_GROUP_FAIL:
			return {
				...state,
				error: payload,
				isLoading: true,
			};

		case UPDATE_SUPER_ADMIN_STATUS_START:
			return {
				...state,
				superAdminStatusLoading: true,
				superAdminStatusError: null,
				superAdminStatus: false,
			};

		case UPDATE_SUPER_ADMIN_STATUS_SUCCESS:
			return {
				...state,
				superAdminStatusLoading: false,
				superAdminStatus: true,
				superAdminStatusError: null,
			};

		case UPDATE_SUPER_ADMIN_STATUS_FAIL:
			return {
				...state,
				superAdminStatusLoading: false,
				superAdminStatusError: payload,
				superAdminStatus: false,
			};

		default:
			return { ...state };
	}
};

export default adminUser;
