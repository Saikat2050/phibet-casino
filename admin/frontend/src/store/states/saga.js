/* eslint-disable no-param-reassign */
import { call, put, takeEvery, select } from 'redux-saga/effects';

// Login Redux States
import { FETCH_STATES_START, UPDATE_STATES_STATUS_START } from './actionTypes';

import {
	fetchStatesFail,
	fetchStatesSuccess,
	updateStateStatusSuccess,
	updateStateStatusFail,
} from './actions';

import { getStates } from '../../network/getRequests';

import { showToastr } from '../../utils/helpers';
import { updateStateStatus } from '../../network/putRequests';

function* fetchStates({ payload }) {
	try {
		const response = yield call(getStates, payload);
		yield put(fetchStatesSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchStatesFail(error));
	}
}

function* updateStatesStatusWorker(action) {
	try {
		const payload = action && action.payload;
		yield updateStateStatus(payload);

		showToastr({
			message: 'Status updated Successfully',
			type: 'success',
		});

		const { states } = yield select((state) => state.States);
		const updatedStates = states?.states?.map((state) => {
			if (state?.id === payload.stateId) {
				state.isActive = !state.isActive;
			}
			return state;
		});

		yield put(
			fetchStatesSuccess({
				...states,
				states: updatedStates,
			})
		);

		yield put(updateStateStatusSuccess());
	} catch (e) {
		yield put(updateStateStatusFail());
	}
}

function* statesSaga() {
	yield takeEvery(FETCH_STATES_START, fetchStates);
	yield takeEvery(UPDATE_STATES_STATUS_START, updateStatesStatusWorker);
}

export default statesSaga;
