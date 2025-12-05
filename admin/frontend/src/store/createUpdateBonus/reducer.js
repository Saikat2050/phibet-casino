import {
	CREATE_BONUS,
	CREATE_BONUS_SUCCESS,
	CREATE_BONUS_FAIL,
	RESET_CREATE_BONUS,
	UPDATE_BONUS,
	UPDATE_BONUS_SUCCESS,
	UPDATE_BONUS_FAIL,
	RESET_UPDATE_BONUS,
} from './actionTypes';

const INIT_STATE = {
	createBonusSuccess: false,
	createBonusLoading: false,
	createBonusError: false,
	updateBonusSuccess: false,
	updateBonusLoading: false,
	updateBonusError: false,
};

const createBonusReducer = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case CREATE_BONUS:
			return {
				...state,
				createBonusLoading: true,
			};

		case CREATE_BONUS_SUCCESS:
			return {
				...state,
				createBonusSuccess: payload,
				createBonusError: false,
				createBonusLoading: false,
			};

		case CREATE_BONUS_FAIL:
			return {
				...state,
				createBonusSuccess: false,
				createBonusError: true,
				createBonusLoading: false,
			};

		case RESET_CREATE_BONUS:
			return {
				...state,
				createBonusSuccess: false,
				createBonusError: false,
				createBonusLoading: false,
			};
		case UPDATE_BONUS:
			return {
				...state,
				updateBonusLoading: true,
			};

		case UPDATE_BONUS_SUCCESS:
			return {
				...state,
				updateBonusSuccess: payload,
				updateBonusError: false,
				updateBonusLoading: false,
			};

		case UPDATE_BONUS_FAIL:
			return {
				...state,
				updateBonusSuccess: false,
				updateBonusError: true,
				updateBonusLoading: false,
			};

		case RESET_UPDATE_BONUS:
			return {
				...state,
				updateBonusSuccess: false,
				updateBonusError: false,
				updateBonusLoading: false,
			};
		default:
			return state;
	}
};

export default createBonusReducer;
