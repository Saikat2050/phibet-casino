import {
	FETCH_ADMIN_ACTIVITY,
	FETCH_ADMIN_ACTIVITY_SUCCESS,
	FETCH_ADMIN_ACTIVITY_FAIL,
} from './actionTypes';

// Fetch (Read) Actions
export const fetchAdminActivity = (payload) => ({
	type: FETCH_ADMIN_ACTIVITY,
	payload,
});

export const fetchAdminActivitySuccess = (payload) => ({
	type: FETCH_ADMIN_ACTIVITY_SUCCESS,
	payload,
});

export const fetchAdminActivityFail = (payload) => ({
	type: FETCH_ADMIN_ACTIVITY_FAIL,
	payload,
});
