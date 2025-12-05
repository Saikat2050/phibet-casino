import { call, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import { FETCH_LANGUAGE_MANAGEMENT_START } from './actionTypes';
import {
	fetchLanguageManagementFail,
	fetchLanguageManagementSuccess,
} from './actions';
import { getLanguageManagement } from '../../network/getRequests';

function* fetchLanguageManagement({ payload }) {
	try {
		const response = yield call(getLanguageManagement, payload);
		yield put(fetchLanguageManagementSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchLanguageManagementFail(error));
	}
}

function* languageManagementSaga() {
	yield takeEvery(FETCH_LANGUAGE_MANAGEMENT_START, fetchLanguageManagement);
}

export default languageManagementSaga;
