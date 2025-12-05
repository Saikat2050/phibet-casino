import {
	FETCH_SPORTS_MARKETS_FAIL,
	FETCH_SPORTS_MARKETS_START,
	FETCH_SPORTS_MARKETS_SUCCESS,
	RESET_SPORTS_MARKETS_DATA,
} from './actionTypes';

export const fetchSportsMarketsStart = (payload) => ({
	type: FETCH_SPORTS_MARKETS_START,
	payload,
});

export const fetchSportsMarketsSuccess = (payload) => ({
	type: FETCH_SPORTS_MARKETS_SUCCESS,
	payload,
});

export const fetchSportsMarketsFail = (history) => ({
	type: FETCH_SPORTS_MARKETS_FAIL,
	payload: { history },
});

export const resetSportsMarketsData = (payload) => ({
	type: RESET_SPORTS_MARKETS_DATA,
	payload,
});
