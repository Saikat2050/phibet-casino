import {
	UPDATE_SPIN_WHEEL_DATA,
	UPDATE_SPIN_WHEEL_DATA_FAIL,
	UPDATE_SPIN_WHEEL_DATA_SUCCESS,
	GET_SPIN_WHEEL_DATA,
	GET_SPIN_WHEEL_DATA_FAIL,
	GET_SPIN_WHEEL_DATA_SUCCESS,
} from './actionTypes';

// Spin-Wheel Actions
export const getSpinWheelData = (payload) => ({
	type: GET_SPIN_WHEEL_DATA,
	payload,
});

export const getSpinWheelDataSuccess = (data) => ({
	type: GET_SPIN_WHEEL_DATA_SUCCESS,
	payload: data,
});

export const getSpinWheelDataFail = (error) => ({
	type: GET_SPIN_WHEEL_DATA_FAIL,
	payload: error,
});

export const updateSpinWheelDataStart = (payload) => ({
	type: UPDATE_SPIN_WHEEL_DATA,
	payload,
});

export const updateSpinWheelDataSuccess = (data) => ({
	type: UPDATE_SPIN_WHEEL_DATA_SUCCESS,
	payload: data,
});

export const updateSpinWheelDataFail = (error) => ({
	type: UPDATE_SPIN_WHEEL_DATA_FAIL,
	payload: error,
});
