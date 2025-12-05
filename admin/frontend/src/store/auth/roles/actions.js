import { ROLES_START, ROLES_ERROR, ROLES_SUCCESS } from './actionTypes';

export const getRolesStart = (loading) => ({
	type: ROLES_START,
	payload: loading,
});

export const getRolesSuccess = (payload) => ({
	type: ROLES_SUCCESS,
	payload,
});

export const getRolesError = (error) => ({
	type: ROLES_ERROR,
	payload: error,
});
