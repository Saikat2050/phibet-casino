import {
	GET_REGISTRATION_FIELDS,
	GET_REGISTRATION_FIELDS_SUCCESS,
	GET_REGISTRATION_FIELDS_FAIL,
	UPDATE_REGISTRATION_FIELDS,
	UPDATE_REGISTRATION_FIELDS_SUCCESS,
	UPDATE_REGISTRATION_FIELDS_FAIL,
	RESET_REGISTRATION_FIELDS,
} from './actionTypes';

export const getRegistrationFieldsSuccess = (payload) => ({
	type: GET_REGISTRATION_FIELDS_SUCCESS,
	payload,
});

export const getRegistrationFieldsFail = (payload) => ({
	type: GET_REGISTRATION_FIELDS_FAIL,
	payload,
});

export const getRegistrationFields = (payload) => ({
	type: GET_REGISTRATION_FIELDS,
	payload,
});

export const resetRegistrationFields = (payload) => ({
	type: RESET_REGISTRATION_FIELDS,
	payload,
});

export const updateRegistrationFieldsSuccess = (payload) => ({
	type: UPDATE_REGISTRATION_FIELDS_SUCCESS,
	payload,
});

export const updateRegistrationFieldsFail = (payload) => ({
	type: UPDATE_REGISTRATION_FIELDS_FAIL,
	payload,
});

export const updateRegistrationFields = (payload) => ({
	type: UPDATE_REGISTRATION_FIELDS,
	payload,
});
