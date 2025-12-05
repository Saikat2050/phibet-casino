/* eslint-disable no-param-reassign */
import { put, takeLatest, all, fork } from 'redux-saga/effects';

// Create Bonus Redux States
import { serialize } from 'object-to-formdata';
import {
	createBonusSuccess,
	createBonusFail,
	updateBonusSuccess,
	updateBonusFail,
} from './actions';
import { CREATE_BONUS, UPDATE_BONUS } from './actionTypes';

import { showToastr } from '../../utils/helpers';
import { createBonusCall, updateBonusCall } from '../../network/postRequests';
import { filterEmptyPayload } from '../../network/networkUtils';

function* createBonusWorker(action) {
	try {
		let payload = action && action.payload;
		payload = serialize(filterEmptyPayload(payload), { indices: true });
		const { data } = yield createBonusCall(payload);

		showToastr({
			message: `Bonus Created Successfully`,
			type: 'success',
		});
		yield put(createBonusSuccess(data?.data));
	} catch (error) {
		yield put(
			createBonusFail(
				error?.response?.data?.errors[0]?.description || error.message
			)
		);
	}
}

function* updateBonusWorker(action) {
	try {
		let payload = action && action.payload;
		payload = serialize(filterEmptyPayload(payload), { indices: true });
		const { data } = yield updateBonusCall(payload);

		showToastr({
			message: `Bonus Updated Successfully`,
			type: 'success',
		});
		yield put(updateBonusSuccess(data?.data));
	} catch (error) {
		yield put(
			updateBonusFail(
				error?.response?.data?.errors[0]?.description || error.message
			)
		);
	}
}

export function* crudBonusWorker() {
	yield takeLatest(CREATE_BONUS, createBonusWorker);
	yield takeLatest(UPDATE_BONUS, updateBonusWorker);
}

function* CreateBonusSaga() {
	yield all([fork(crudBonusWorker)]);
}

export default CreateBonusSaga;
