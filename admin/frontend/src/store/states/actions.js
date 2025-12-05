import {
	FETCH_STATES_FAIL,
	FETCH_STATES_START,
	FETCH_STATES_SUCCESS,
	UPDATE_STATES_STATUS_START,
	UPDATE_STATES_STATUS_SUCCESS,
	UPDATE_STATES_STATUS_FAIL,
	RESET_STATES_DATA,
} from './actionTypes';

export const fetchStatesStart = (payload) => ({
	type: FETCH_STATES_START,
	payload,
});

export const fetchStatesSuccess = (states) => ({
	type: FETCH_STATES_SUCCESS,
	payload: states,
});

export const fetchStatesFail = (history) => ({
	type: FETCH_STATES_FAIL,
	payload: { history },
});

export const resetStatesData = (payload) => ({
	type: RESET_STATES_DATA,
	payload,
});

export const updateStateStatusStart = (payload) => ({
	type: UPDATE_STATES_STATUS_START,
	payload,
});

export const updateStateStatusSuccess = (payload) => ({
	type: UPDATE_STATES_STATUS_SUCCESS,
	payload,
});

export const updateStateStatusFail = (payload) => ({
	type: UPDATE_STATES_STATUS_FAIL,
	payload,
});
