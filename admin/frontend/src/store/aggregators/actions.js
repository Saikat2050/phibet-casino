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

export const getAggregatorsList = (data) => ({
	type: GET_AGGREGATORS_START,
	payload: data,
});

export const getAggregatorsListSuccess = (data) => ({
	type: GET_AGGREGATORS_SUCCESS,
	payload: data,
});

export const getAggregatorsListFailure = (error) => ({
	type: GET_AGGREGATORS_FAILURE,
	payload: error,
});

export const resetAggregatorsList = (payload) => ({
	type: RESET_AGGREGATORS_DATA,
	payload,
});

export const createAggregatorSuccess = (payload) => ({
	type: CREATE_AGGREGATORS_SUCCESS,
	payload,
});

export const createAggregatorFail = (payload) => ({
	type: CREATE_AGGREGATORS_FAIL,
	payload,
});

export const createAggregatorStart = (payload) => ({
	type: CREATE_AGGREGATORS_START,
	payload,
});

export const updateAggregatorStatusSuccess = (payload) => ({
	type: UPDATE_AGGREGATORS_STATUS_SUCCESS,
	payload,
});

export const updateAggregatorStatusFail = (payload) => ({
	type: UPDATE_AGGREGATORS_STATUS_FAIL,
	payload,
});

export const updateAggregatorStatusStart = (payload) => ({
	type: UPDATE_AGGREGATORS_STATUS_START,
	payload,
});
