import {
	CREATE_SEGMENTATION_START,
	CREATE_SEGMENTATION_SUCCESS,
	CREATE_SEGMENTATION_FAIL,
	FETCH_SEGMENTATION,
	FETCH_SEGMENTATION_SUCCESS,
	FETCH_SEGMENTATION_FAIL,
	UPDATE_SEGMENTATION_START,
	UPDATE_SEGMENTATION_SUCCESS,
	UPDATE_SEGMENTATION_FAIL,
	DELETE_SEGMENTATION_START,
	DELETE_SEGMENTATION_SUCCESS,
	DELETE_SEGMENTATION_FAIL,
	FETCH_SEGMENTATION_DETAILS,
	FETCH_SEGMENTATION_DETAILS_SUCCESS,
	FETCH_SEGMENTATION_DETAILS_FAIL,
	FETCH_SEGMENTATION_CONSTANTS,
	FETCH_SEGMENTATION_CONSTANTS_SUCCESS,
	FETCH_SEGMENTATION_CONSTANTS_FAIL,
	RESET_SEGMENTATION_DETAILS,
} from './actionTypes';

// Create Actions
export const createSegmentation = (payload) => ({
	type: CREATE_SEGMENTATION_START,
	payload,
});

export const createSegmentationSuccess = (payload) => ({
	type: CREATE_SEGMENTATION_SUCCESS,
	payload,
});

export const createSegmentationFail = (payload) => ({
	type: CREATE_SEGMENTATION_FAIL,
	payload,
});

// Fetch (Read) Actions
export const fetchSegmentation = (payload) => ({
	type: FETCH_SEGMENTATION,
	payload,
});

export const fetchSegmentationSuccess = (payload) => ({
	type: FETCH_SEGMENTATION_SUCCESS,
	payload,
});

export const fetchSegmentationFail = (payload) => ({
	type: FETCH_SEGMENTATION_FAIL,
	payload,
});

// Update Actions
export const updateSegmentation = (payload) => ({
	type: UPDATE_SEGMENTATION_START,
	payload,
});

export const updateSegmentationSuccess = (payload) => ({
	type: UPDATE_SEGMENTATION_SUCCESS,
	payload,
});

export const updateSegmentationFail = (payload) => ({
	type: UPDATE_SEGMENTATION_FAIL,
	payload,
});

// Delete Actions
export const deleteSegmentation = (payload) => ({
	type: DELETE_SEGMENTATION_START,
	payload,
});

export const deleteSegmentationSuccess = (payload) => ({
	type: DELETE_SEGMENTATION_SUCCESS,
	payload,
});

export const deleteSegmentationFail = (payload) => ({
	type: DELETE_SEGMENTATION_FAIL,
	payload,
});

export const fetchSegmentationDetails = (payload) => ({
	type: FETCH_SEGMENTATION_DETAILS,
	payload,
});

export const fetchSegmentationDetailsSuccess = (payload) => ({
	type: FETCH_SEGMENTATION_DETAILS_SUCCESS,
	payload,
});

export const fetchSegmentationDetailsFail = (error) => ({
	type: FETCH_SEGMENTATION_DETAILS_FAIL,
	payload: error,
});

export const resetSegmentationDetails = () => ({
	type: RESET_SEGMENTATION_DETAILS,
});

export const fetchSegmentationConstants = () => ({
	type: FETCH_SEGMENTATION_CONSTANTS,
});

export const fetchSegmentationConstantsSuccess = (payload) => ({
	type: FETCH_SEGMENTATION_CONSTANTS_SUCCESS,
	payload,
});

export const fetchSegmentationConstantsFail = (error) => ({
	type: FETCH_SEGMENTATION_CONSTANTS_FAIL,
	payload: error,
});
