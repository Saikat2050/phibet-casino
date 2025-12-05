import {
	GET_BET_SETTINGS_DATA,
	GET_BET_SETTINGS_DATA_SUCCESS,
	GET_BET_SETTINGS_DATA_FAIL,
	CREATE_BET_SETTINGS_SUCCESS,
	CREATE_BET_SETTINGS_FAIL,
	CREATE_BET_SETTINGS_START,
	EDIT_BET_SETTINGS_SUCCESS,
	EDIT_BET_SETTINGS_FAIL,
	EDIT_BET_SETTINGS_START,
	RESET_BET_SETTINGS_DATA,
} from './actionTypes';

export const getBetSettingsDataSuccess = (payload) => ({
	type: GET_BET_SETTINGS_DATA_SUCCESS,
	payload,
});

export const getBetSettingsDataFail = (payload) => ({
	type: GET_BET_SETTINGS_DATA_FAIL,
	payload,
});

export const getBetSettingsData = () => ({
	type: GET_BET_SETTINGS_DATA,
});

export const resetBetSettingsData = () => ({
	type: RESET_BET_SETTINGS_DATA,
});

export const createBetSettingsSuccess = (payload) => ({
	type: CREATE_BET_SETTINGS_SUCCESS,
	payload,
});

export const createBetSettingsFail = (payload) => ({
	type: CREATE_BET_SETTINGS_FAIL,
	payload,
});

export const createBetSettingsStart = (payload) => ({
	type: CREATE_BET_SETTINGS_START,
	payload,
});

export const editBetSettingsSuccess = (payload) => ({
	type: EDIT_BET_SETTINGS_SUCCESS,
	payload,
});

export const editBetSettingsFail = (payload) => ({
	type: EDIT_BET_SETTINGS_FAIL,
	payload,
});

export const editBetSettingsStart = (payload) => ({
	type: EDIT_BET_SETTINGS_START,
	payload,
});
