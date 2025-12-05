import { call, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import { FETCH_LANGUAGES_START } from './actionTypes';
import { fetchLanguagesFail, fetchLanguagesSuccess } from './actions';
import { getLanguages } from '../../network/getRequests';

function* fetchLanguages({ payload }) {
	try {
		const response = yield call(getLanguages, payload);
		yield put(fetchLanguagesSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchLanguagesFail(error));
	}
}

function* languagesSaga() {
	yield takeEvery(FETCH_LANGUAGES_START, fetchLanguages);
}

export default languagesSaga;
