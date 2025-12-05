import {
	GET_ALL_GROUP_START,
	GET_ALL_GROUP_SUCCESS,
	GET_ALL_GROUP_FAIL,
	UPDATE_SUPER_ADMIN_STATUS_START,
	UPDATE_SUPER_ADMIN_STATUS_SUCCESS,
	UPDATE_SUPER_ADMIN_STATUS_FAIL,
} from './actionTypes';

export const getAllGroupsSuccess = (payload) => ({
	type: GET_ALL_GROUP_SUCCESS,
	payload,
});

export const getAllGroupsFailure = (payload) => ({
	type: GET_ALL_GROUP_FAIL,
	payload,
});

export const getAllGroupsStart = (payload) => ({
	type: GET_ALL_GROUP_START,
	payload,
});

export const updateSuperAdminStatusSuccess = (payload) => ({
	type: UPDATE_SUPER_ADMIN_STATUS_SUCCESS,
	payload,
});

export const updateSuperAdminStatusFailure = (payload) => ({
	type: UPDATE_SUPER_ADMIN_STATUS_FAIL,
	payload,
});

export const updateSuperAdminStatusStart = (payload) => ({
	type: UPDATE_SUPER_ADMIN_STATUS_START,
	payload,
});
