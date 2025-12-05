import { call, put, takeEvery } from 'redux-saga/effects';
// Login Redux States
import {
	APPROVE_REJECT_WITHDRAW_REQUESTS_START,
	FETCH_WITHDRAW_REQUESTS_START,
} from './actionTypes';
import {
	approveRejectWithdrawRequestsFail,
	approveRejectWithdrawRequestsSuccess,
	fetchWithdrawRequestsFail,
	fetchWithdrawRequestsSuccess,
} from './actions';
import { getWithdrawRequests } from '../../network/getRequests';
import { postApproveRejectWithdrawalRequests } from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';

function* fetchWithdrawRequests(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getWithdrawRequests, payload);

		yield put(fetchWithdrawRequestsSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchWithdrawRequestsFail(error));
	}
}

function* approveRejectWithdrawalRequest(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(postApproveRejectWithdrawalRequests, payload);

		showToastr({
			message:
				payload.status === 'approved'
					? 'Redeem Request Approved'
					: 'Redeem Request Rejected',
			type: payload.status === 'approved' ? 'success' : 'error',
		});

		yield put(approveRejectWithdrawRequestsSuccess(response?.data?.data));
	} catch (error) {
		yield put(approveRejectWithdrawRequestsFail(error));
	}
}

function* withdrawRequestsSaga() {
	yield takeEvery(FETCH_WITHDRAW_REQUESTS_START, fetchWithdrawRequests);
	yield takeEvery(
		APPROVE_REJECT_WITHDRAW_REQUESTS_START,
		approveRejectWithdrawalRequest
	);
}

export default withdrawRequestsSaga;
