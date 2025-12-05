import { put, all, fork, takeEvery } from 'redux-saga/effects';

// Crypto Redux States
import {
	getRegistrationFieldsSuccess,
	getRegistrationFieldsFail,
	updateRegistrationFieldsSuccess,
	updateRegistrationFieldsFail,
	getRegistrationFields,
} from './actions';
import {
	GET_REGISTRATION_FIELDS,
	UPDATE_REGISTRATION_FIELDS,
} from './actionTypes';

import { getGlobalRegistration } from '../../network/getRequests';
import { updateGlobalRegistration } from '../../network/putRequests';
import { showToastr } from '../../utils/helpers';

function* getGlobalRegistrationWorker() {
	try {
		const { data } = yield getGlobalRegistration();

		yield put(getRegistrationFieldsSuccess(data?.data));
	} catch (e) {
		yield put(getRegistrationFieldsFail());
	}
}

function* updateGlobalRegistartionWorker(action) {
	try {
		const { data } = action && action.payload;

		yield updateGlobalRegistration(data);

		yield put(updateRegistrationFieldsSuccess());
		yield put(getRegistrationFields());
		showToastr({
			message: 'Global registration updated successfully.',
			type: 'success',
		});
	} catch (e) {
		yield put(updateRegistrationFieldsFail());
	}
}

export function* getGlobalRegistrationWatcher() {
	yield takeEvery(GET_REGISTRATION_FIELDS, getGlobalRegistrationWorker);
}

export function* updateGlobalRegistrationWatcher() {
	yield takeEvery(UPDATE_REGISTRATION_FIELDS, updateGlobalRegistartionWorker);
}

function* GlobalRegistrationSaga() {
	yield all([fork(getGlobalRegistrationWatcher)]);
	yield all([fork(updateGlobalRegistrationWatcher)]);
}

export default GlobalRegistrationSaga;
