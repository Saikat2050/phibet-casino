import {
	FETCH_ALL_REFERRALS_FAIL,
	FETCH_ALL_REFERRALS_START,
	FETCH_ALL_REFERRALS_SUCCESS,
	EDIT_ALL_REFERRALS_START,
	EDIT_ALL_REFERRALS_SUCCESS,
	EDIT_ALL_REFERRALS_FAIL,
	RESET_ALL_REFERRALS_DATA,
} from './actionTypes';

const initialState = {
	allReferralsData: null,
	error: '',
	loading: false,

	isEditAllReferralsError: false,
	isEditAllReferralsSuccess: false,
	isEditAllReferralsLoading: false,
};

const notificationReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case FETCH_ALL_REFERRALS_START:
			return {
				...state,
				isEditAllReferralsLoading: false,
				loading: true,
			};

		case FETCH_ALL_REFERRALS_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};

		case FETCH_ALL_REFERRALS_SUCCESS:
			return {
				...state,
				loading: false,
				allReferralsData: payload,
			};

		case RESET_ALL_REFERRALS_DATA:
			return {
				...state,
				loading: false,
				allReferralsData: null,
				error: '',
			};

		case EDIT_ALL_REFERRALS_START:
			return {
				...state,
				isEditAllReferralsLoading: true,
				isEditAllReferralsSuccess: false,
			};

		case EDIT_ALL_REFERRALS_SUCCESS:
			return {
				...state,
				isEditAllReferralsLoading: false,
				isEditAllReferralsSuccess: true,
			};

		case EDIT_ALL_REFERRALS_FAIL:
			return {
				...state,
				isEditAllReferralsError: payload,
				isEditAllReferralsLoading: false,
				isEditAllReferralsSuccess: false,
			};

		default:
			return { ...state };
	}
};

export default notificationReducer;
