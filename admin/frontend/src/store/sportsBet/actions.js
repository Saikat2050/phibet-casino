import {
	FETCH_SPORTS_BET_FAIL,
	FETCH_SPORTS_BET_START,
	FETCH_SPORTS_BET_SUCCESS,
	RESET_SPORTS_BET_DATA,
} from './actionTypes';

export const fetchSportsBetStart = (payload) => ({
	type: FETCH_SPORTS_BET_START,
	payload,
});

export const fetchSportsBetSuccess = (payload) => ({
	type: FETCH_SPORTS_BET_SUCCESS,
	payload,
});

export const fetchSportsBetFail = (history) => ({
	type: FETCH_SPORTS_BET_FAIL,
	payload: { history },
});

export const resetSportsBetData = (payload) => ({
	type: RESET_SPORTS_BET_DATA,
	payload,
});
