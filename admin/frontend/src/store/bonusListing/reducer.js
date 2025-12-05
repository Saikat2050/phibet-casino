import {
	GET_BONUSES_START,
	GET_BONUSES_SUCCESS,
	GET_BONUSES_FAIL,
	UPDATE_SA_BONUS_STATUS,
	UPDATE_SA_BONUS_STATUS_SUCCESS,
	UPDATE_SA_BONUS_STATUS_FAIL,
	GET_BONUS_DETAIL,
	GET_BONUS_DETAIL_SUCCESS,
	GET_BONUS_DETAIL_FAIL,
	DELETE_BONUS_START,
	DELETE_BONUS_FAIL,
	DELETE_BONUS_COMPLETE,
	REORDER_BONUS_START,
	REORDER_BONUS_SUCCESS,
	REORDER_BONUS_FAIL,
	RESET_BONUS_DETAILS_DATA,
} from './actionTypes';

const INIT_STATE = {
	bonusDetails: null,
	error: null,
	isLoading: true,
	gameBonusDetail: null,
	gameBonusSegment: null,
	isBonusDetailsLoading: false,
	isUpdateSABonusStatusLoading: false,
	isUpdateSABonusStatusError: null,
	isUpdateSABonusStatusSuccess: false,
	reorderBonusSuccess: false,
	reorderBonusLoading: false,
	reorderBonusError: null,
};

const getAllBonusDetails = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_BONUSES_START:
			return {
				...state,
				isLoading: false,
			};

		case GET_BONUSES_SUCCESS:
			return {
				...state,
				isLoading: true,
				bonusDetails: payload,
				error: null,
			};

		case GET_BONUSES_FAIL:
			return {
				...state,
				error: payload,
				isLoading: true,
			};

		case RESET_BONUS_DETAILS_DATA:
			return {
				...state,
				isLoading: true,
				bonusDetails: null,
				error: null,
			};

		case UPDATE_SA_BONUS_STATUS:
			return {
				...state,
				isUpdateSABonusStatusLoading: true,
			};

		case UPDATE_SA_BONUS_STATUS_SUCCESS:
			return {
				...state,
				isUpdateSABonusStatusLoading: false,
				isUpdateSABonusStatusSuccess: true,
				isUpdateSABonusStatusError: null,
			};

		case UPDATE_SA_BONUS_STATUS_FAIL:
			return {
				...state,
				isUpdateSABonusStatusLoading: false,
				isUpdateSABonusStatusError: payload,
				isUpdateSABonusStatusSuccess: false,
			};

		case GET_BONUS_DETAIL:
			return {
				...state,
				isBonusDetailsLoading: true,
			};

		case GET_BONUS_DETAIL_SUCCESS:
			return {
				...state,
				gameBonusDetail: payload?.bonus,
				gameBonusSegment: payload?.tags,
				error: null,
				isBonusDetailsLoading: false,
			};

		case GET_BONUS_DETAIL_FAIL:
			return {
				...state,
				error: payload,
				isBonusDetailsLoading: false,
			};

		case DELETE_BONUS_START:
			return {
				...state,
				isDeleteBonusLoading: true,
			};

		case DELETE_BONUS_COMPLETE:
			return {
				...state,
				isDeleteBonusLoading: false,
			};

		case DELETE_BONUS_FAIL:
			return {
				...state,
				error: payload,
				isDeleteBonusLoading: false,
			};

		case REORDER_BONUS_START:
			return {
				...state,
				reorderBonusLoading: true,
				reorderBonusSuccess: false,
				reorderBonusError: null,
			};

		case REORDER_BONUS_SUCCESS:
			return {
				...state,
				reorderBonusLoading: false,
				reorderBonusSuccess: true,
				reorderBonusError: null,
			};

		case REORDER_BONUS_FAIL:
			return {
				...state,
				reorderBonusLoading: false,
				reorderBonusSuccess: false,
				reorderBonusError: payload,
			};

		default:
			return { ...state };
	}
};

export default getAllBonusDetails;
