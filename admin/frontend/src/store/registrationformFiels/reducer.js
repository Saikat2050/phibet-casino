import {
	GET_REGISTRATION_FIELDS,
	GET_REGISTRATION_FIELDS_SUCCESS,
	GET_REGISTRATION_FIELDS_FAIL,
	UPDATE_REGISTRATION_FIELDS,
	UPDATE_REGISTRATION_FIELDS_SUCCESS,
	UPDATE_REGISTRATION_FIELDS_FAIL,
	RESET_REGISTRATION_FIELDS,
} from './actionTypes';

const INIT_STATE = {
	formFields: null,
	error: null,
	isformFieldsLoading: false,
	updateFormFields: false,
	updateFormFieldsError: null,
	isUpdateFormFieldsLoading: false,
};

const FormFields = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_REGISTRATION_FIELDS:
			return {
				...state,
				isformFieldsLoading: true,
			};

		case GET_REGISTRATION_FIELDS_SUCCESS:
			return {
				...state,
				isformFieldsLoading: false,
				formFields: payload,
				error: null,
			};

		case GET_REGISTRATION_FIELDS_FAIL:
			return {
				...state,
				error: payload,
				isformFieldsLoading: false,
			};

		case RESET_REGISTRATION_FIELDS:
			return {
				...state,
				isformFieldsLoading: false,
				formFields: null,
				error: null,
			};

		case UPDATE_REGISTRATION_FIELDS:
			return {
				...state,
				isUpdateFormFieldsLoading: true,
			};

		case UPDATE_REGISTRATION_FIELDS_SUCCESS:
			return {
				...state,
				isUpdateFormFieldsLoading: false,
				updateFormFields: true,
				updateFormFieldsError: null,
			};

		case UPDATE_REGISTRATION_FIELDS_FAIL:
			return {
				...state,
				updateFormFieldsError: payload,
				isUpdateFormFieldsLoading: false,
			};

		default:
			return { ...state };
	}
};

export default FormFields;
