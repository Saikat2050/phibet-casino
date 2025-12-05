import {
	GET_BET_SETTINGS_DATA,
	GET_BET_SETTINGS_DATA_SUCCESS,
	GET_BET_SETTINGS_DATA_FAIL,
	CREATE_BET_SETTINGS_START,
	CREATE_BET_SETTINGS_SUCCESS,
	CREATE_BET_SETTINGS_FAIL,
	EDIT_BET_SETTINGS_START,
	EDIT_BET_SETTINGS_SUCCESS,
	EDIT_BET_SETTINGS_FAIL,
	RESET_BET_SETTINGS_DATA,
} from './actionTypes';

const INIT_STATE = {
	betSettingsList: null,
	error: null,
	isLoading: true,
	isCreateBetSettingsError: false,
	isCreateBetSettingsSuccess: false,
	isCreateBetSettingsLoading: false,
	isEditBetSettingsError: false,
	isEditBetSettingsSuccess: false,
	isEditBetSettingsLoading: false,
};

const BetSettings = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_BET_SETTINGS_DATA:
			return {
				...state,
				isLoading: false,
			};

		case GET_BET_SETTINGS_DATA_SUCCESS:
			return {
				...state,
				isLoading: true,
				betSettingsList: payload,
				error: null,
			};

		case GET_BET_SETTINGS_DATA_FAIL:
			return {
				...state,
				error: payload,
				isLoading: true,
			};

		case RESET_BET_SETTINGS_DATA:
			return {
				...state,
				betSettingsList: null,
				error: null,
				isLoading: true,
			};

		case CREATE_BET_SETTINGS_START:
			return {
				...state,
				isCreateBetSettingsLoading: true,
				isCreateBetSettingsSuccess: false,
			};

		case CREATE_BET_SETTINGS_SUCCESS:
			return {
				...state,
				isCreateBetSettingsLoading: false,
				isCreateBetSettingsSuccess: true,
			};

		case CREATE_BET_SETTINGS_FAIL:
			return {
				...state,
				isCreateBetSettingsError: payload,
				isCreateBetSettingsLoading: false,
				isCreateBetSettingsSuccess: false,
			};

		case EDIT_BET_SETTINGS_START:
			return {
				...state,
				isEditBetSettingsLoading: true,
				isEditBetSettingsSuccess: false,
			};

		case EDIT_BET_SETTINGS_SUCCESS:
			return {
				...state,
				isEditBetSettingsLoading: false,
				isEditBetSettingsSuccess: true,
			};

		case EDIT_BET_SETTINGS_FAIL:
			return {
				...state,
				isEditBetSettingsError: payload,
				isEditBetSettingsLoading: false,
				isEditBetSettingsSuccess: false,
			};

		default:
			return { ...state };
	}
};

export default BetSettings;
