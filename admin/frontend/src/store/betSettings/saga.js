import { put, takeLatest, all, fork } from 'redux-saga/effects';

// Crypto Redux States
import {
	getBetSettingsDataSuccess,
	getBetSettingsDataFail,
	createBetSettingsSuccess,
	createBetSettingsFail,
	editBetSettingsSuccess,
	editBetSettingsFail,
} from './actions';
import {
	CREATE_BET_SETTINGS_START,
	EDIT_BET_SETTINGS_START,
	GET_BET_SETTINGS_DATA,
} from './actionTypes';

import { getBetSettings } from '../../network/getRequests';
import { createBetSettings } from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';
import { editBetSettings } from '../../network/putRequests';
import { formPageTitle } from '../../components/Common/constants';

function* betSettingsWorker() {
	try {
		const { data } = yield getBetSettings();
		yield put(getBetSettingsDataSuccess(data?.data?.dbBetObj));
	} catch (error) {
		yield put(
			getBetSettingsDataFail(error?.response?.data?.errors[0]?.description)
		);
	}
}

function* createBetSettingsWorker(action) {
	try {
		const { data } = action && action.payload;

		yield createBetSettings(data);

		showToastr({
			message: `BetSettings Created Successfully`,
			type: 'success',
		});

		window.localStorage.removeItem(formPageTitle.betSettings);

		yield put(createBetSettingsSuccess());
	} catch (e) {
		yield put(createBetSettingsFail());
	}
}

function* editBetSettingsWorker(action) {
	try {
		const { data } = action && action.payload;

		yield editBetSettings(data);

		showToastr({
			message: `Bet settings updated Successfully`,
			type: 'success',
		});

		yield put(editBetSettingsSuccess());
	} catch (e) {
		yield put(editBetSettingsFail());
	}
}

export function* betSettingsWatcher() {
	yield takeLatest(GET_BET_SETTINGS_DATA, betSettingsWorker);
	yield takeLatest(CREATE_BET_SETTINGS_START, createBetSettingsWorker);
	yield takeLatest(EDIT_BET_SETTINGS_START, editBetSettingsWorker);
}

function* BetSettingsSaga() {
	yield all([fork(betSettingsWatcher)]);
}

export default BetSettingsSaga;
