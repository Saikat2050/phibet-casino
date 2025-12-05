/* eslint-disable no-param-reassign */
import { call, put, takeLatest } from 'redux-saga/effects';

// Login Redux States
import {
	AMOE_STATUS_START,
	EDIT_AMOE_START,
	FETCH_AMOE_START,
} from './actionTypes';
import {
	editAmoeSettingsSuccess,
	fetchAmoeFail,
	fetchAmoeSuccess,
	amoeStatusSuccess,
	amoeStatusFail,
	fetchAmoeStart,
	editAmoeSettingsFail,
} from './actions';
import { amoeRequests } from '../../network/getRequests';
import { statusAmoe } from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';
import { getSiteConfigurationStart } from '../actions';
import { updateAmoe } from '../../network/putRequests';

function* fetchAmoeWatcher({ payload }) {
	try {
		const response = yield call(amoeRequests, payload);
		yield put(fetchAmoeSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchAmoeFail(error));
	}
}

function* updateAmoeWorker(action) {
	try {
		const { values, callback } = action && action.payload;

		yield updateAmoe(values);
		yield put(editAmoeSettingsSuccess());
		yield put(getSiteConfigurationStart());
		showToastr({
			message: `AMOE settings updated successfully`,
			type: 'success',
		});
		if (callback) {
			callback();
		}
	} catch (e) {
		yield put(
			editAmoeSettingsFail(e?.message || 'An unexpected error occurred')
		);
		showToastr({
			message: e?.message || 'Failed to update AMOE settings',
			type: 'error',
		});
		console.warn('Error while AMOE setting update', e?.message || '');
	}
}

function* updateAmoeStatusWorker(action) {
	try {
		const data = action && action.payload;
		yield statusAmoe(data);
		yield put(amoeStatusSuccess());
		yield put(
			fetchAmoeStart({
				perPage: 10,
				page: 1,
			})
		);
		showToastr({
			message: `AMOE ${data?.status} successfully`,
			type: 'success',
		});
	} catch (e) {
		console.warn('Error while AMOE update', e?.message || '');
		yield put(amoeStatusFail());
	}
}
function* AmoeSaga() {
	yield takeLatest(FETCH_AMOE_START, fetchAmoeWatcher);
	yield takeLatest(EDIT_AMOE_START, updateAmoeWorker);
	yield takeLatest(AMOE_STATUS_START, updateAmoeStatusWorker);
}

export default AmoeSaga;
