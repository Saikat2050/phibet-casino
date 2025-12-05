import { call, put, takeEvery } from 'redux-saga/effects';
import { GET_SPIN_WHEEL_DATA, UPDATE_SPIN_WHEEL_DATA } from './actionTypes';
import {
	getSpinWheelDataSuccess,
	getSpinWheelDataFail,
	updateSpinWheelDataSuccess,
	updateSpinWheelDataFail,
	getSpinWheelData,
} from './actions';
import { spinWheelRequests } from '../../network/getRequests';
import { showToastr } from '../../utils/helpers';
import { updateSpinWheelRequests } from '../../network/putRequests';

function* fetchSpinWheelData({ payload }) {
	try {
		const response = yield call(spinWheelRequests, payload);
		yield put(getSpinWheelDataSuccess(response?.data?.data));
	} catch (error) {
		yield put(
			getSpinWheelDataFail(error.message || 'Failed to fetch spin-wheel data')
		);
	}
}

function* updateSpinWheelData({ payload }) {
	try {
		const response = yield call(updateSpinWheelRequests, payload);
		showToastr({
			message: `Spin Wheel Data Updated Successfully`,
			type: 'success',
		});
		yield put(getSpinWheelData());
		yield put(updateSpinWheelDataSuccess(response?.data?.data));
	} catch (error) {
		yield put(
			updateSpinWheelDataFail(
				error.message || 'Failed to update spin-wheel data'
			)
		);
	}
}

function* spinWheelSaga() {
	yield takeEvery(GET_SPIN_WHEEL_DATA, fetchSpinWheelData);
	yield takeEvery(UPDATE_SPIN_WHEEL_DATA, updateSpinWheelData);
}

export default spinWheelSaga;
