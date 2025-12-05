/* eslint-disable no-param-reassign */
import { call, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import {
	EDIT_ALL_REFERRALS_START,
	FETCH_ALL_REFERRALS_START,
} from './actionTypes';
import {
	editReferralSuccess,
	fetchAllReferralsFail,
	fetchAllReferralsSuccess,
} from './actions';
import { getAllReferrals } from '../../network/getRequests';
import { updateReferralRequest } from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';
import { getSiteConfigurationStart } from '../actions';

function* fetchAllReferrals({ payload }) {
	try {
		const response = yield call(getAllReferrals, payload);
		yield put(fetchAllReferralsSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchAllReferralsFail(error));
	}
}

function* updateReferralWorker(action) {
	try {
		const data = action && action.payload;

		yield updateReferralRequest(data);
		yield put(editReferralSuccess());
		yield put(getSiteConfigurationStart());
		showToastr({
			message: `Referral settings updated successfully`,
			type: 'success',
		});
	} catch (e) {
		console.warn('Error while referral setting update', e?.message || '');
	}
}

function* ReferralSaga() {
	yield takeEvery(FETCH_ALL_REFERRALS_START, fetchAllReferrals);
	yield takeEvery(EDIT_ALL_REFERRALS_START, updateReferralWorker);
}

export default ReferralSaga;
