import { put, call, takeEvery } from 'redux-saga/effects';

import {
	applyAdvanceFilterFailure,
	applyAdvanceFilterSuccess,
	downloadReportFailure,
	downloadReportSuccess,
} from './actions';
import { applyAdvanceFilterRequest } from '../../network/postRequests';
import { APPLY_ADVANCE_FILTER, DOWNLOAD_REPORT } from './actionTypes';
import { showToastr } from '../../utils/helpers';

function* advanceFilterWorker(action) {
	try {
		const { payload } = action;
		const response = yield call(applyAdvanceFilterRequest, payload);
		yield put(applyAdvanceFilterSuccess(response?.data?.data));
	} catch (error) {
		yield put(applyAdvanceFilterFailure(error.message));
	}
}

function* downloadReportWorker(action) {
	try {
		const { payload } = action;
		const { updatedValues, callBack } = payload;
		const response = yield call(applyAdvanceFilterRequest, updatedValues);
		if (response?.data?.data) {
			showToastr({
				message: 'CSV report has been successfully sent to the entered email.',
				type: 'success',
			});
			if (callBack) {
				callBack();
			}
		}
		yield put(downloadReportSuccess());
	} catch (error) {
		showToastr({
			message: 'Failed to send CSV report.',
			type: 'error',
		});
		yield put(downloadReportFailure());
	}
}
function* advanceFilterSaga() {
	yield takeEvery(APPLY_ADVANCE_FILTER, advanceFilterWorker);
	yield takeEvery(DOWNLOAD_REPORT, downloadReportWorker);
}
export default advanceFilterSaga;
