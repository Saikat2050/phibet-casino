import { call, put, takeEvery } from 'redux-saga/effects';
import {
	CREATE_SEGMENTATION_START,
	DELETE_SEGMENTATION_START,
	FETCH_SEGMENTATION,
	FETCH_SEGMENTATION_CONSTANTS,
	FETCH_SEGMENTATION_DETAILS,
	UPDATE_SEGMENTATION_START,
} from './actionTypes';
import {
	fetchSegmentationSuccess,
	fetchSegmentationFail,
	updateSegmentationSuccess,
	updateSegmentationFail,
	deleteSegmentationSuccess,
	deleteSegmentationFail,
	createSegmentationSuccess,
	createSegmentationFail,
	fetchSegmentationConstantsSuccess,
	fetchSegmentationConstantsFail,
	fetchSegmentationDetailsSuccess,
	fetchSegmentationDetailsFail,
	fetchSegmentation,
} from './actions';
// import { getSegments } from '../../network/getRequests';
import { createSegmentationRequest } from '../../network/postRequests';
import {
	getSegmentationUsersRequest,
	getSegments,
	getSegmentsConstant,
	// getSegmentsDetail,
} from '../../network/getRequests';
import { deleteSegmentationRequest } from '../../network/deleteRequests';
import { updateSegmentationRequest } from '../../network/putRequests';
import { showToastr } from '../../utils/helpers';

function* fetchSegmentationWorker(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getSegments, payload);

		yield put(fetchSegmentationSuccess(response?.data));
	} catch (error) {
		yield put(fetchSegmentationFail(error));
	}
}

function* createSegmentationWorker(action) {
	try {
		const { payload, handleCallback } = action && action.payload;
		yield createSegmentationRequest(payload);
		yield put(createSegmentationSuccess());
		if (handleCallback) handleCallback();
		showToastr({
			message: 'Segmentation created Successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(createSegmentationFail(error.message));
	}
}

// Update Segmentation
function* updateSegmentationWorker(action) {
	try {
		const { payload, handleCallback } = action && action.payload;
		yield updateSegmentationRequest(payload);
		if (handleCallback) handleCallback();
		yield put(updateSegmentationSuccess());
		showToastr({
			message: 'Segmentation updated Successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(updateSegmentationFail());
	}
}

// Delete Segmentation
function* deleteSegmentationWorker(action) {
	try {
		const payload = action && action.payload;
		yield deleteSegmentationRequest(payload);
		yield put(deleteSegmentationSuccess());
		yield put(fetchSegmentation());
		showToastr({
			message: 'Segmentation deleted Successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(deleteSegmentationFail(error.message));
	}
}

function* fetchSegmentationConstantsWorker() {
	try {
		const response = yield call(getSegmentsConstant);
		yield put(fetchSegmentationConstantsSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchSegmentationConstantsFail(error.message));
	}
}

function* fetchSegmentationDetailsWorker(action) {
	try {
		const payload = action && action.payload;
		const response = yield getSegmentationUsersRequest(payload);
		yield put(fetchSegmentationDetailsSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchSegmentationDetailsFail(error));
	}
}

function* segmentationSaga() {
	yield takeEvery(FETCH_SEGMENTATION, fetchSegmentationWorker);
	yield takeEvery(CREATE_SEGMENTATION_START, createSegmentationWorker);
	yield takeEvery(UPDATE_SEGMENTATION_START, updateSegmentationWorker);
	yield takeEvery(DELETE_SEGMENTATION_START, deleteSegmentationWorker);
	yield takeEvery(
		FETCH_SEGMENTATION_CONSTANTS,
		fetchSegmentationConstantsWorker
	);
	yield takeEvery(FETCH_SEGMENTATION_DETAILS, fetchSegmentationDetailsWorker);
}

export default segmentationSaga;
