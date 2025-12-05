import {
	FETCH_REVIEW_MANAGEMENT_FAIL,
	FETCH_REVIEW_MANAGEMENT_START,
	FETCH_REVIEW_MANAGEMENT_SUCCESS,
	CREATE_REVIEW_FAIL,
	CREATE_REVIEW_START,
	CREATE_REVIEW_SUCCESS,
	UPDATE_REVIEW_START,
	UPDATE_REVIEW_FAIL,
	UPDATE_REVIEW_SUCCESS,
	RESET_REVIEW_MANAGEMENT_DATA,
} from './actionTypes';

const initialState = {
	reviewManagement: null,
	error: '',
	loading: false,
	isCreateReviewError: false,
	isCreateReviewSuccess: false,
	isCreateReviewLoading: false,
	isUpdateReviewError: null,
	isUpdateReviewSuccess: false,
	isUpdateReviewLoading: false,
};

const reviewManagementReducer = (
	state = initialState,
	{ type, payload } = {}
) => {
	switch (type) {
		case FETCH_REVIEW_MANAGEMENT_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_REVIEW_MANAGEMENT_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_REVIEW_MANAGEMENT_SUCCESS:
			return {
				...state,
				loading: false,
				reviewManagement: payload,
			};
		case RESET_REVIEW_MANAGEMENT_DATA:
			return {
				...state,
				loading: false,
				reviewManagement: null,
				error: '',
			};
		case CREATE_REVIEW_START:
			return {
				...state,
				isCreateReviewLoading: true,
				isCreateReviewSuccess: false,
			};

		case CREATE_REVIEW_SUCCESS:
			return {
				...state,
				isCreateReviewLoading: false,
				isCreateReviewSuccess: true,
			};

		case CREATE_REVIEW_FAIL:
			return {
				...state,
				isCreateReviewError: payload,
				isCreateReviewLoading: false,
				isCreateReviewSuccess: false,
			};
		case UPDATE_REVIEW_START:
			return {
				...state,
				isUpdateReviewLoading: true,
				isUpdateReviewSuccess: false,
				isUpdateReviewError: null,
			};
		case UPDATE_REVIEW_SUCCESS:
			return {
				...state,
				isUpdateReviewLoading: false,
				isUpdateReviewSuccess: true,
				isUpdateReviewError: null,
			};
		case UPDATE_REVIEW_FAIL:
			return {
				...state,
				isUpdateReviewError: payload,
				isUpdateReviewLoading: false,
				isUpdateReviewSuccess: false,
			};
		default:
			return { ...state };
	}
};

export default reviewManagementReducer;
