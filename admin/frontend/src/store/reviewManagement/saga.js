import { call, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import {
	CREATE_REVIEW_START,
	FETCH_REVIEW_MANAGEMENT_START,
	UPDATE_REVIEW_START,
} from './actionTypes';
import {
	createReviewFail,
	createReviewSuccess,
	fetchReviewManagementFail,
	fetchReviewManagementSuccess,
	updateReviewSuccess,
	updateReviewFail,
} from './actions';
import { getReviewManagement } from '../../network/getRequests';
import { createReview } from '../../network/postRequests';
import { updateReview } from '../../network/putRequests';
import { showToastr } from '../../utils/helpers';
import { formPageTitle } from '../../components/Common/constants';

function* fetchReviewManagement(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getReviewManagement, payload);
		yield put(
			fetchReviewManagementSuccess(response?.data?.data?.reviewDetails)
		);
	} catch (error) {
		yield put(fetchReviewManagementFail(error));
	}
}

function* createReviewWorker(action) {
	try {
		const { data } = action && action.payload;

		yield createReview(data);

		showToastr({
			message: `Review Created Successfully`,
			type: 'success',
		});

		window.localStorage.removeItem(formPageTitle.reviewManagement);

		yield put(createReviewSuccess());
	} catch (e) {
		yield put(createReviewFail());
	}
}

function* updateReviewWorker(action) {
	try {
		const { data } = action && action.payload;

		yield updateReview({ data });

		yield put(updateReviewSuccess());

		showToastr({
			message: `Review Updated Successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(updateReviewFail());
	}
}

function* reviewManagementSaga() {
	yield takeEvery(FETCH_REVIEW_MANAGEMENT_START, fetchReviewManagement);
	yield takeEvery(CREATE_REVIEW_START, createReviewWorker);
	yield takeEvery(UPDATE_REVIEW_START, updateReviewWorker);
}

export default reviewManagementSaga;
