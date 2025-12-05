import {
	GET_SPIN_WHEEL_DATA,
	GET_SPIN_WHEEL_DATA_FAIL,
	GET_SPIN_WHEEL_DATA_SUCCESS,
	UPDATE_SPIN_WHEEL_DATA,
	UPDATE_SPIN_WHEEL_DATA_FAIL,
	UPDATE_SPIN_WHEEL_DATA_SUCCESS,
} from './actionTypes';

const initialState = {
	spinWheelData: null, // Data for the spin-wheel
	loading: false, // Indicates loading state
	error: '', // Tracks error message
	updateSpinWheelLoading: false,
	updateSpinWheelerror: '',
};

const spinWheelReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case GET_SPIN_WHEEL_DATA:
			return {
				...state,
				loading: true,
				error: '',
			};
		case GET_SPIN_WHEEL_DATA_SUCCESS:
			return {
				...state,
				loading: false,
				spinWheelData: payload,
				error: '',
			};
		case GET_SPIN_WHEEL_DATA_FAIL:
			return {
				...state,
				loading: false,
				error: payload,
			};
		case UPDATE_SPIN_WHEEL_DATA:
			return {
				...state,
				updateSpinWheelLoading: true,
				updateSpinWheelerror: '',
			};
		case UPDATE_SPIN_WHEEL_DATA_SUCCESS:
			return {
				...state,
				updateSpinWheelLoading: false,
				spinWheelData: payload,
				updateSpinWheelerror: '',
			};
		case UPDATE_SPIN_WHEEL_DATA_FAIL:
			return {
				...state,
				updateSpinWheelLoading: false,
				updateSpinWheelerror: payload,
			};

		default:
			return state;
	}
};

export default spinWheelReducer;
