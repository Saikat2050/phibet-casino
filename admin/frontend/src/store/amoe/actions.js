import {
	FETCH_AMOE_FAIL,
	FETCH_AMOE_START,
	FETCH_AMOE_SUCCESS,
	EDIT_AMOE_SUCCESS,
	EDIT_AMOE_FAIL,
	EDIT_AMOE_START,
	RESET_AMOE_DATA,
	AMOE_STATUS_START,
	AMOE_STATUS_FAIL,
	AMOE_STATUS_SUCCESS,
} from './actionTypes';

export const fetchAmoeStart = (payload) => ({
	type: FETCH_AMOE_START,
	payload,
});

export const fetchAmoeSuccess = (payload) => ({
	type: FETCH_AMOE_SUCCESS,
	payload,
});

export const fetchAmoeFail = (history) => ({
	type: FETCH_AMOE_FAIL,
	payload: { history },
});

export const resetAmoeData = (history) => ({
	type: RESET_AMOE_DATA,
	payload: { history },
});

export const editAmoeSettingsSuccess = (payload) => ({
	type: EDIT_AMOE_SUCCESS,
	payload,
});

export const editAmoeSettingsFail = (payload) => ({
	type: EDIT_AMOE_FAIL,
	payload,
});

export const editAmoeSettingsStart = (payload) => ({
	type: EDIT_AMOE_START,
	payload,
});

export const amoeStatusStart = (payload) => ({
	type: AMOE_STATUS_START,
	payload,
});

export const amoeStatusFail = (payload) => ({
	type: AMOE_STATUS_FAIL,
	payload,
});

export const amoeStatusSuccess = (payload) => ({
	type: AMOE_STATUS_SUCCESS,
	payload,
});
