import {
	ADD_RESTRICTED_STATES_FAIL,
	ADD_RESTRICTED_STATES_START,
	ADD_RESTRICTED_STATES_SUCCESS,
} from './actionTypes';

export const addRestrictedStatesStart = (payload) => ({
	type: ADD_RESTRICTED_STATES_START,
	payload,
});

export const addRestrictedStatesSuccess = (payload) => ({
	type: ADD_RESTRICTED_STATES_SUCCESS,
	payload,
});

export const addRestrictedStatesFail = (payload) => ({
	type: ADD_RESTRICTED_STATES_FAIL,
	payload,
});
