import {
	FETCH_PLAYER_PERFORMANCE_FAIL,
	FETCH_PLAYER_PERFORMANCE_START,
	FETCH_PLAYER_PERFORMANCE_SUCCESS,
} from './actionTypes';

export const fetchPlayerPerformanceStart = (payload) => ({
	type: FETCH_PLAYER_PERFORMANCE_START,
	payload,
});

export const fetchPlayerPerformanceSuccess = (payload) => ({
	type: FETCH_PLAYER_PERFORMANCE_SUCCESS,
	payload,
});

export const fetchPlayerPerformanceFail = (history) => ({
	type: FETCH_PLAYER_PERFORMANCE_FAIL,
	payload: { history },
});
