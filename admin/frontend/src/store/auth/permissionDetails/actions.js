import {
	SUPER_ADMIN_START,
	SUPER_ADMIN_SUCCESS,
	SUPER_ADMIN_FAIL,
} from './actionTypes';

export const getSuperAdminStart = (payload) => ({
	type: SUPER_ADMIN_START,
	payload,
});

export const getSuperAdminSuccess = (payload) => ({
	type: SUPER_ADMIN_SUCCESS,
	payload,
});

export const getSuperAdminFail = (payload) => ({
	type: SUPER_ADMIN_FAIL,
	payload,
});
