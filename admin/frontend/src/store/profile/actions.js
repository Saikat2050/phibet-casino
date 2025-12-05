import {
	UPDATE_PROFILE_START,
	UPDATE_PROFILE_SUCCESS,
	UPDATE_PROFILE_FAIL,
	UPDATE_SITE_CONFIGURATION_START,
	RESET_PROFILE_PASSWORD_START,
	RESET_PROFILE_PASSWORD_SUCCESS,
	RESET_PROFILE_PASSWORD_FAIL,
	GET_SITE_CONFIGURATION_START,
	GET_SITE_CONFIGURATION_SUCCESS,
	GET_SITE_CONFIGURATION_FAIL,
	UPDATE_LOGO,
	UPDATE_APP_SETTING,
} from './actionTypes';

export const updateProfileStart = (payload) => ({
	type: UPDATE_PROFILE_START,
	payload,
});

export const updateProfileSuccess = (payload) => ({
	type: UPDATE_PROFILE_SUCCESS,
	payload,
});

export const updateProfileFail = (payload) => ({
	type: UPDATE_PROFILE_FAIL,
	payload,
});

export const updateSiteConfigurationStart = (payload) => ({
	type: UPDATE_SITE_CONFIGURATION_START,
	payload,
});

export const updateLogo = (payload) => ({
	type: UPDATE_LOGO,
	payload,
});

export const updateAppSetting = (payload) => ({
	type: UPDATE_APP_SETTING,
	payload,
});

export const resetProfilePasswordStart = (payload) => ({
	type: RESET_PROFILE_PASSWORD_START,
	payload,
});

export const resetProfilePasswordSuccess = (payload) => ({
	type: RESET_PROFILE_PASSWORD_SUCCESS,
	payload,
});

export const resetProfilePasswordFail = (payload) => ({
	type: RESET_PROFILE_PASSWORD_FAIL,
	payload,
});

export const getSiteConfigurationStart = (payload) => ({
	type: GET_SITE_CONFIGURATION_START,
	payload,
});

export const getSiteConfigurationSuccess = (payload) => ({
	type: GET_SITE_CONFIGURATION_SUCCESS,
	payload,
});

export const getSiteConfigurationFail = (payload) => ({
	type: GET_SITE_CONFIGURATION_FAIL,
	payload,
});
