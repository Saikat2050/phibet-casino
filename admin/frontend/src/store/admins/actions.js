import {
	GET_ADMINS_DATA,
	GET_ADMINS_DATA_SUCCESS,
	GET_ADMINS_DATA_FAIL,
	ADD_SUPER_ADMIN_USER_SUCCESS,
	ADD_SUPER_ADMIN_USER_FAIL,
	ADD_SUPER_ADMIN_USER,
	UPDATE_SUPER_ADMIN_USER_SUCCESS,
	UPDATE_SUPER_ADMIN_USER_FAIL,
	UPDATE_SUPER_ADMIN_USER,
	GET_ADMIN_CHILDREN_SUCCESS,
	GET_ADMIN_CHILDREN_FAIL,
	GET_ADMIN_CHILDREN,
	RESET_ADMINS_DATA,
} from './actionTypes';

export const getAllAdminsSuccess = (payload) => ({
	type: GET_ADMINS_DATA_SUCCESS,
	payload,
});

export const getAllAdminsFail = (payload) => ({
	type: GET_ADMINS_DATA_FAIL,
	payload,
});

export const getAllAdmins = (payload) => ({
	type: GET_ADMINS_DATA,
	payload,
});

export const resetAdminsData = (payload) => ({
	type: RESET_ADMINS_DATA,
	payload,
});

export const addSuperAdminUserSuccess = (payload) => ({
	type: ADD_SUPER_ADMIN_USER_SUCCESS,
	payload,
});

export const addSuperAdminUserFail = (payload) => ({
	type: ADD_SUPER_ADMIN_USER_FAIL,
	payload,
});

export const addSuperAdminUserStart = (payload) => ({
	type: ADD_SUPER_ADMIN_USER,
	payload,
});

export const updateSuperAdminUserSuccess = (payload) => ({
	type: UPDATE_SUPER_ADMIN_USER_SUCCESS,
	payload,
});

export const updateSuperAdminUserFail = (payload) => ({
	type: UPDATE_SUPER_ADMIN_USER_FAIL,
	payload,
});

export const updateSuperAdminUserStart = (payload) => ({
	type: UPDATE_SUPER_ADMIN_USER,
	payload,
});

export const getAdminChildrenSuccess = (payload) => ({
	type: GET_ADMIN_CHILDREN_SUCCESS,
	payload,
});

export const getAdminChildrenFail = (payload) => ({
	type: GET_ADMIN_CHILDREN_FAIL,
	payload,
});

export const getAdminChildren = () => ({
	type: GET_ADMIN_CHILDREN,
});
