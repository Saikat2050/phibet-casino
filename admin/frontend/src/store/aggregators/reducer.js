import {
	GET_AGGREGATORS_START,
	GET_AGGREGATORS_FAILURE,
	GET_AGGREGATORS_SUCCESS,
	CREATE_AGGREGATORS_START,
	CREATE_AGGREGATORS_FAIL,
	CREATE_AGGREGATORS_SUCCESS,
	UPDATE_AGGREGATORS_STATUS_START,
	UPDATE_AGGREGATORS_STATUS_FAIL,
	UPDATE_AGGREGATORS_STATUS_SUCCESS,
	RESET_AGGREGATORS_DATA,
} from './actionTypes';

const INIT_STATE = {
	aggregatorsData: [],
	error: {},
	loading: true,
	isCreateAggregatorError: null,
	isCreateAggregatorSuccess: false,
	isCreateAggregatorLoading: false,
	updateAggregatorsStatus: false,
	updateAggregatorsStatusError: null,
	updateAggregatorsStatusLoading: false,
};

const AggregatorsReducer = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_AGGREGATORS_START:
			return {
				...state,
				loading: true,
			};

		case GET_AGGREGATORS_FAILURE:
			return {
				...state,
				error: payload,
				loading: false,
			};

		case GET_AGGREGATORS_SUCCESS:
			return {
				...state,
				aggregatorsData: payload,
				loading: false,
			};

		case RESET_AGGREGATORS_DATA:
			return {
				...state,
				aggregatorsData: [],
				loading: true,
				error: {},
			};

		case CREATE_AGGREGATORS_START:
			return {
				...state,
				isCreateAggregatorLoading: true,
				isCreateAggregatorSuccess: false,
			};

		case CREATE_AGGREGATORS_SUCCESS:
			return {
				...state,
				isCreateAggregatorLoading: false,
				isCreateAggregatorSuccess: true,
			};

		case CREATE_AGGREGATORS_FAIL:
			return {
				...state,
				isCreateAggregatorError: payload,
				isCreateAggregatorLoading: false,
				isCreateAggregatorSuccess: false,
			};

		case UPDATE_AGGREGATORS_STATUS_START:
			return {
				...state,
				updateAggregatorsStatusLoading: true,
			};

		case UPDATE_AGGREGATORS_STATUS_SUCCESS:
			return {
				...state,
				updateAggregatorsStatusLoading: false,
				updateAggregatorsStatusSuccess: true,
				updateAggregatorsStatusError: null,
			};

		case UPDATE_AGGREGATORS_STATUS_FAIL:
			return {
				...state,
				updateAggregatorsStatusLoading: false,
				updateAggregatorsStatusError: payload,
				updateAggregatorsStatusSuccess: false,
			};

		default:
			return state;
	}
};

export default AggregatorsReducer;
