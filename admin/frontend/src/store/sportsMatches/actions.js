import {
	FETCH_SPORTS_MATCHES_FAIL,
	FETCH_SPORTS_MATCHES_START,
	FETCH_SPORTS_MATCHES_SUCCESS,
	UPDATE_SPORTS_FEATURED_MATCHES_START,
	UPDATE_SPORTS_FEATURED_MATCHES_FAIL,
	UPDATE_SPORTS_FEATURED_MATCHES_SUCCESS,
	RESET_SPORTS_MATCHES_DATA,
} from './actionTypes';

export const fetchSportsMatchesStart = (payload) => ({
	type: FETCH_SPORTS_MATCHES_START,
	payload,
});

export const fetchSportsMatchesSuccess = (payload) => ({
	type: FETCH_SPORTS_MATCHES_SUCCESS,
	payload,
});

export const fetchSportsMatchesFail = (history) => ({
	type: FETCH_SPORTS_MATCHES_FAIL,
	payload: { history },
});

export const resetSportsMatchesData = (payload) => ({
	type: RESET_SPORTS_MATCHES_DATA,
	payload,
});

export const updateFeaturedMatchStart = (payload) => ({
	type: UPDATE_SPORTS_FEATURED_MATCHES_START,
	payload,
});

export const updateFeaturedMatchSuccess = (payload) => ({
	type: UPDATE_SPORTS_FEATURED_MATCHES_SUCCESS,
	payload,
});

export const updateFeaturedMatchFail = (history) => ({
	type: UPDATE_SPORTS_FEATURED_MATCHES_FAIL,
	payload: { history },
});
