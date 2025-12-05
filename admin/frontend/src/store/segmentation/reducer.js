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

const initialState = {
	segmentationData: null,
	error: '',
	loading: false,
	segmentationDetailsData: [],
	loadingSegmentationDetails: false,
	segmentationConstants: null,
	loadingSegmentationConstants: false,
	isSubmitLoading: false,
};

const segmentationReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		// Create
		case CREATE_SEGMENTATION_START:
			return {
				...state,
				isSubmitLoading: true,
			};
		case CREATE_SEGMENTATION_SUCCESS:
			return {
				...state,
				isSubmitLoading: false,
			};
		case CREATE_SEGMENTATION_FAIL:
			return {
				...state,
				isSubmitLoading: false,
				error: payload,
			};

		// Fetch
		case FETCH_SEGMENTATION:
			return {
				...state,
				loading: true,
			};
		case FETCH_SEGMENTATION_SUCCESS:
			return {
				...state,
				loading: false,
				segmentationData: payload,
			};
		case FETCH_SEGMENTATION_FAIL:
			return {
				...state,
				loading: false,
				error: payload,
			};

		// Update
		case UPDATE_SEGMENTATION_START:
			return {
				...state,
				isSubmitLoading: true,
			};
		case UPDATE_SEGMENTATION_SUCCESS:
			return {
				...state,
				isSubmitLoading: false,
			};
		case UPDATE_SEGMENTATION_FAIL:
			return {
				...state,
				isSubmitLoading: false,
				error: payload,
			};

		// Delete
		case DELETE_SEGMENTATION_START:
			return {
				...state,
				loading: true,
			};
		case DELETE_SEGMENTATION_SUCCESS:
			return {
				...state,
				loading: false,
			};
		case DELETE_SEGMENTATION_FAIL:
			return {
				...state,
				loading: false,
				error: payload,
			};

		case FETCH_SEGMENTATION_DETAILS:
			return {
				...state,
				loadingSegmentationDetails: true,
				error: '',
			};
		case FETCH_SEGMENTATION_DETAILS_SUCCESS:
			return {
				...state,
				loadingSegmentationDetails: false,
				segmentationDetailsData: payload,
			};
		case FETCH_SEGMENTATION_DETAILS_FAIL:
			return {
				...state,
				loadingSegmentationDetails: false,
				segmentationDetailsData: [],
				error: payload,
			};
		case RESET_SEGMENTATION_DETAILS:
			return {
				...state,
				segmentationDetailsData: [],
			};
		case FETCH_SEGMENTATION_CONSTANTS:
			return {
				...state,
				loadingSegmentationConstants: true,
				error: '',
			};
		case FETCH_SEGMENTATION_CONSTANTS_SUCCESS:
			return {
				...state,
				loadingSegmentationConstants: false,
				segmentationConstants: payload,
			};
		case FETCH_SEGMENTATION_CONSTANTS_FAIL:
			return {
				...state,
				loadingSegmentationConstants: false,
				error: payload,
			};
		default:
			return state;
	}
};

export default segmentationReducer;
