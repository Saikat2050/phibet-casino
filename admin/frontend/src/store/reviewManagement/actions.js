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

export const fetchReviewManagementStart = (payload) => ({
	type: FETCH_REVIEW_MANAGEMENT_START,
	payload,
});

export const fetchReviewManagementSuccess = (payload) => ({
	type: FETCH_REVIEW_MANAGEMENT_SUCCESS,
	payload,
});

export const fetchReviewManagementFail = (history) => ({
	type: FETCH_REVIEW_MANAGEMENT_FAIL,
	payload: { history },
});

export const resetReviewManagementData = (payload) => ({
	type: RESET_REVIEW_MANAGEMENT_DATA,
	payload,
});

export const createReviewSuccess = (payload) => ({
	type: CREATE_REVIEW_SUCCESS,
	payload,
});

export const createReviewFail = (payload) => ({
	type: CREATE_REVIEW_FAIL,
	payload,
});

export const createReviewStart = (payload) => ({
	type: CREATE_REVIEW_START,
	payload,
});

export const updateReviewSuccess = (payload) => ({
	type: UPDATE_REVIEW_SUCCESS,
	payload,
});

export const updateReviewFail = (payload) => ({
	type: UPDATE_REVIEW_FAIL,
	payload,
});

export const updateReviewStart = (payload) => ({
	type: UPDATE_REVIEW_START,
	payload,
});
