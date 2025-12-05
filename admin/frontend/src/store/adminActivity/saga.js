import { call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_ADMIN_ACTIVITY } from './actionTypes';
import { fetchAdminActivitySuccess, fetchAdminActivityFail } from './actions';
import { getAdminActivity } from '../../network/getRequests';

function* fetchAdminActivityWorker(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getAdminActivity, payload);

		yield put(fetchAdminActivitySuccess(response?.data));
	} catch (error) {
		yield put(fetchAdminActivityFail(error));
	}
}

function* adminActivitySaga() {
	yield takeEvery(FETCH_ADMIN_ACTIVITY, fetchAdminActivityWorker);
}

export default adminActivitySaga;
