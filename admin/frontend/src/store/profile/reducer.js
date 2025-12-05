import {
	UPDATE_PROFILE_START,
	UPDATE_PROFILE_FAIL,
	UPDATE_PROFILE_SUCCESS,
	RESET_PROFILE_PASSWORD_START,
	RESET_PROFILE_PASSWORD_SUCCESS,
	RESET_PROFILE_PASSWORD_FAIL,
	GET_SITE_CONFIGURATION_START,
	GET_SITE_CONFIGURATION_SUCCESS,
	GET_SITE_CONFIGURATION_FAIL,
} from './actionTypes';

const initialState = {
	updateProfileSuccess: false,
	updateProfileError: null,
	updateProfileLoading: false,
	resetProfilePasswordLoading: false,
	resetProfilePasswordSuccess: false,
	resetProfilePasswordError: null,
	siteConfigDetails: null,
	siteConfigLoading: false,
	siteConfigError: null,
};

const ProfileData = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case UPDATE_PROFILE_START:
			return {
				...state,
				updateProfileLoading: true,
			};
		case UPDATE_PROFILE_FAIL:
			return {
				...state,
				updateProfileLoading: false,
				updateProfileSuccess: false,
				updateProfileError: payload,
			};
		case UPDATE_PROFILE_SUCCESS:
			return {
				...state,
				updateProfileLoading: false,
				updateProfileSuccess: true,
				updateProfileError: null,
			};
		case RESET_PROFILE_PASSWORD_START:
			return {
				...state,
				resetProfilePasswordLoading: true,
			};
		case RESET_PROFILE_PASSWORD_SUCCESS:
			return {
				...state,
				resetProfilePasswordLoading: false,
				resetProfilePasswordSuccess: true,
				resetProfilePasswordError: null,
			};
		case RESET_PROFILE_PASSWORD_FAIL:
			return {
				...state,
				resetProfilePasswordLoading: false,
				resetProfilePasswordError: payload,
				resetProfilePasswordSuccess: false,
			};
		case GET_SITE_CONFIGURATION_START:
			return {
				...state,
				siteConfigLoading: true,
				siteConfigDetails: null,
				siteConfigError: null,
			};
		case GET_SITE_CONFIGURATION_FAIL:
			return {
				...state,
				siteConfigLoading: false,
				siteConfigDetails: null,
				siteConfigError: payload,
			};
		case GET_SITE_CONFIGURATION_SUCCESS:
			return {
				...state,
				siteConfigLoading: false,
				siteConfigDetails: payload,
				siteConfigError: null,
			};

		default:
			return { ...state };
	}
};

export default ProfileData;
