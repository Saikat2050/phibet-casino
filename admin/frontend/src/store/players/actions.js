import {
	FETCH_PLAYERS_FAIL,
	FETCH_PLAYERS_START,
	FETCH_PLAYERS_SUCCESS,
	RESET_PLAYERS_DATA,
} from './actionTypes';

export const fetchPlayersStart = (payload) => ({
	type: FETCH_PLAYERS_START,
	payload,
});

export const fetchPlayersSuccess = (Players) => ({
	type: FETCH_PLAYERS_SUCCESS,
	payload: Players,
});

export const fetchPlayersFail = (history) => ({
	type: FETCH_PLAYERS_FAIL,
	payload: { history },
});

export const resetPlayersData = (history) => ({
	type: RESET_PLAYERS_DATA,
	payload: { history },
});
