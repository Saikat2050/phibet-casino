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

export const applyAdvanceFilter = (payload) => ({
	type: APPLY_ADVANCE_FILTER,
	payload,
});

export const applyAdvanceFilterSuccess = (payload) => ({
	type: APPLY_ADVANCE_FILTER_SUCCESS,
	payload,
});

export const applyAdvanceFilterFailure = (error) => ({
	type: APPLY_ADVANCE_FILTER_FAILURE,
	payload: error,
});

export const downloadReport = (payload) => ({
	type: DOWNLOAD_REPORT,
	payload,
});

export const downloadReportSuccess = (payload) => ({
	type: DOWNLOAD_REPORT_SUCCESS,
	payload,
});

export const downloadReportFailure = (error) => ({
	type: DOWNLOAD_REPORT_FAILURE,
	payload: error,
});

export const resetAdvanceFilter = (payload) => ({
	type: RESET_ADVANCE_FILTER,
	payload,
});

export const storeFilterData = (payload) => ({
	type: STORE_FILTER_DATA,
	payload,
});

export const storeFilterDataRemove = (payload) => ({
	type: REMOVE_FILTER_DATA,
	payload,
});
