import {
	GET_WAGERING_TEMPLATE_DETAIL,
	GET_WAGERING_TEMPLATE_DETAIL_SUCCESS,
	GET_WAGERING_TEMPLATE_DETAIL_FAIL,
	GET_WAGERING_TEMPLATE_DETAILS,
	GET_WAGERING_TEMPLATE_DETAILS_SUCCESS,
	GET_ALL_WAGERING_TEMPLATE_DETAILS_FAIL,
	CREATE_WAGERING_TEMPLATE_DETAILS,
	CREATE_WAGERING_TEMPLATE_DETAILS_SUCCESS,
	CREATE_WAGERING_TEMPLATE_DETAILS_FAIL,
	EDIT_WAGERING_TEMPLATE_DETAILS,
	EDIT_WAGERING_TEMPLATE_DETAILS_SUCCESS,
	EDIT_WAGERING_TEMPLATE_DETAILS_FAIL,
	RESET_WAGERING_TEMPLATE_DETAIL,
	RESET_WAGERING_TEMPLATE_DETAIL_DATA,
} from './actionTypes';

const INIT_STATE = {
	SAWageringTemplate: null,
	SAWageringTemplateLoading: false,
	SAWageringTemplateError: null,

	wageringTemplateDetailLoading: false,
	wageringTemplateDetailError: null,
	wageringTemplateDetail: null,

	createWageringTemplateDetailLoading: false,
	createWageringTemplateDetailError: null,
	createWageringTemplateDetail: false,

	editWageringTemplateDetailLoading: false,
	editWageringTemplateDetailError: null,
	editWageringTemplateDetailSuccess: false,
};

const WageringTemplate = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_WAGERING_TEMPLATE_DETAIL:
			return {
				...state,
				SAWageringTemplateLoading: true,
			};

		case GET_WAGERING_TEMPLATE_DETAIL_SUCCESS:
			return {
				...state,
				SAWageringTemplateLoading: false,
				SAWageringTemplate: payload,
				SAWageringTemplateError: null,
			};

		case GET_WAGERING_TEMPLATE_DETAIL_FAIL:
			return {
				...state,
				SAWageringTemplateLoading: false,
				SAWageringTemplateError: payload,
			};

		case RESET_WAGERING_TEMPLATE_DETAIL:
			return {
				...state,
				SAWageringTemplateLoading: false,
				SAWageringTemplate: null,
				SAWageringTemplateError: null,
			};

		case GET_WAGERING_TEMPLATE_DETAILS:
			return {
				...state,
				wageringTemplateDetailLoading: true,
			};

		case GET_WAGERING_TEMPLATE_DETAILS_SUCCESS:
			return {
				...state,
				wageringTemplateDetailLoading: false,
				wageringTemplateDetail: payload,
				wageringTemplateDetailError: null,
			};

		case RESET_WAGERING_TEMPLATE_DETAIL_DATA:
			return {
				...state,
				wageringTemplateDetailLoading: false,
				wageringTemplateDetail: null,
				wageringTemplateDetailError: null,
			};

		case GET_ALL_WAGERING_TEMPLATE_DETAILS_FAIL:
			return {
				...state,
				wageringTemplateDetailError: payload,
				wageringTemplateDetailLoading: true,
			};

		case CREATE_WAGERING_TEMPLATE_DETAILS:
			return {
				...state,
				createWageringTemplateDetailLoading: true,
			};

		case CREATE_WAGERING_TEMPLATE_DETAILS_SUCCESS:
			return {
				...state,
				createWageringTemplateDetailLoading: false,
				createWageringTemplateDetail: true,
				createWageringTemplateDetailError: null,
			};

		case CREATE_WAGERING_TEMPLATE_DETAILS_FAIL:
			return {
				...state,
				createWageringTemplateDetailError: payload,
				createWageringTemplateDetailLoading: true,
				createWageringTemplateDetail: false,
			};

		case EDIT_WAGERING_TEMPLATE_DETAILS:
			return {
				...state,
				editWageringTemplateDetailLoading: true,
			};

		case EDIT_WAGERING_TEMPLATE_DETAILS_SUCCESS:
			return {
				...state,
				editWageringTemplateDetailLoading: false,
				editWageringTemplateDetailSuccess: true,
				editWageringTemplateDetailError: null,
			};

		case EDIT_WAGERING_TEMPLATE_DETAILS_FAIL:
			return {
				...state,
				editWageringTemplateDetailError: payload,
				editWageringTemplateDetailLoading: true,
				editWageringTemplateDetailSuccess: false,
			};

		default:
			return { ...state };
	}
};

export default WageringTemplate;
