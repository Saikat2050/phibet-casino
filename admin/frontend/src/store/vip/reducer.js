import {
	EDIT_VIP_TIER_FAIL,
	EDIT_VIP_TIER_START,
	EDIT_VIP_TIER_SUCCESS,
	// CREATE_VIP_TIER_START,
	CREATE_VIP_TIER_SUCCESS,
	CREATE_VIP_TIER_FAIL,
	GET_VIP_TIER_START,
	GET_VIP_TIER_SUCCESS,
	GET_VIP_TIER_FAIL,
	GET_VIP_TIER_BY_ID_START,
	GET_VIP_TIER_BY_ID_SUCCESS,
	GET_VIP_TIER_BY_ID_FAIL,
} from './actionTypes';

const initialState = {
	vipTiers: {},
	vipTiersLoading: false,
	vipTiersError: null,

	editVIPTierLoading: false,
	editVIPTierSuccessMsg: null,
	editVIPTierError: null,

	createVIPTierLoading: false,
	createVIPTierSuccessMsg: null,
	createVIPTierError: null,

	vipTierDetails: {},
	vipTierDetailsLoading: false,
	vipTierDetailsError: null,
};

const VIPTiers = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case GET_VIP_TIER_START:
			return {
				...state,
				vipTiersLoading: true,
				vipTiers: null,
				vipTiersError: null,
			};
		case GET_VIP_TIER_SUCCESS:
			return {
				...state,
				vipTiersLoading: false,
				vipTiers: payload,
				vipTiersError: null,
			};
		case GET_VIP_TIER_FAIL:
			return {
				...state,
				vipTiersLoading: false,
				vipTiers: null,
				vipTiersError: payload,
			};
		case GET_VIP_TIER_BY_ID_START:
			return {
				...state,
				vipTierDetailsLoading: true,
				vipTierDetails: null,
				vipTierDetailsError: null,
			};
		case GET_VIP_TIER_BY_ID_SUCCESS:
			return {
				...state,
				vipTierDetailsLoading: false,
				vipTierDetails: payload,
			};
		case GET_VIP_TIER_BY_ID_FAIL:
			return {
				...state,
				vipTierDetailsLoading: false,
				vipTierDetailsError: payload,
			};
		case EDIT_VIP_TIER_START:
			return {
				...state,
				editVIPTierLoading: true,
				editVIPTierSuccessMsg: null,
				editVIPTierError: null,
			};
		case EDIT_VIP_TIER_SUCCESS:
			return {
				...state,
				editVIPTierLoading: false,
				editVIPTierSuccessMsg: payload,
				editVIPTierError: null,
			};
		case EDIT_VIP_TIER_FAIL:
			return {
				...state,
				editVIPTierLoading: false,
				editVIPTierSuccessMsg: null,
				// data: payload,
				editVIPTierError: payload,
			};
		case CREATE_VIP_TIER_SUCCESS:
			return {
				...state,
				createVIPTierLoading: false,
				createVIPTierSuccessMsg: payload,
				createVIPTierError: null,
			};
		case CREATE_VIP_TIER_FAIL:
			return {
				...state,
				createVIPTierLoading: false,
				createVIPTierError: payload,
			};
		default:
			return { ...state };
	}
};

export default VIPTiers;
