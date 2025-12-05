import {
	APPLY_ADVANCE_FILTER,
	APPLY_ADVANCE_FILTER_FAILURE,
	APPLY_ADVANCE_FILTER_SUCCESS,
	DOWNLOAD_REPORT,
	DOWNLOAD_REPORT_FAILURE,
	DOWNLOAD_REPORT_SUCCESS,
	REMOVE_FILTER_DATA,
	RESET_ADVANCE_FILTER,
	STORE_FILTER_DATA,
} from './actionTypes';

const initialState = {
	filterData: null,
	error: '',
	loading: false,
	storeFilterData: [],
	isDownloadLading: false,
};

const advancedFilterReducer = (
	state = initialState,
	{ type, payload } = {}
) => {
	switch (type) {
		case APPLY_ADVANCE_FILTER:
			return {
				...state,
				loading: true,
				error: '',
			};
		case APPLY_ADVANCE_FILTER_SUCCESS:
			return {
				...state,
				loading: false,
				filterData: payload,
			};
		case APPLY_ADVANCE_FILTER_FAILURE:
			return {
				...state,
				loading: false,
				error: payload,
			};

		case RESET_ADVANCE_FILTER:
			return {
				...state,
				storeFilterData: [],
				filterData: null,
				error: '',
			};
		case STORE_FILTER_DATA:
			return {
				...state,
				storeFilterData: payload,
			};

		case REMOVE_FILTER_DATA:
			return {
				...state,
				storeFilterData: [],
			};
		case DOWNLOAD_REPORT:
			return {
				...state,
				isDownloadLading: true,
			};
		case DOWNLOAD_REPORT_SUCCESS:
			return {
				...state,
				isDownloadLading: false,
			};
		case DOWNLOAD_REPORT_FAILURE:
			return {
				...state,
				isDownloadLading: false,
			};

		default:
			return state;
	}
};

export default advancedFilterReducer;
