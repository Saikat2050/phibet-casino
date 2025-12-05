import {
	CREATE_TOURNAMENT_FAIL,
	CREATE_TOURNAMENT_START,
	CREATE_TOURNAMENT_SUCCESS,
	GET_TOURNAMENT_DETAILS_START,
	GET_TOURNAMENT_DETAILS_SUCCESS,
	GET_TOURNAMENT_DETAILS_FAIL,
	GET_TOURNAMENT_DETAIL_BY_ID_START,
	GET_TOURNAMENT_DETAIL_BY_ID_SUCCESS,
	GET_TOURNAMENT_DETAIL_BY_ID_FAIL,
	RESET_TOURNAMENT_DETAIL_START,
	UPDATE_TOURNAMENT_START,
	UPDATE_TOURNAMENT_SUCCESS,
	UPDATE_TOURNAMENT_FAIL,
	GET_TOURNAMENT_LEADERBOARD_DETAIL_START,
	GET_TOURNAMENT_LEADERBOARD_DETAIL_SUCCESS,
	GET_TOURNAMENT_LEADERBOARD_DETAIL_FAIL,
	UPDATE_TOURNAMENT_STATUS_START,
	UPDATE_TOURNAMENT_STATUS_SUCCESS,
	UPDATE_TOURNAMENT_STATUS_FAIL,
	GET_TOURNAMENT_TRANSACTIONS_START,
	GET_TOURNAMENT_TRANSACTIONS_SUCCESS,
	GET_TOURNAMENT_TRANSACTIONS_FAIL,
} from './actionTypes';

export const createTournamentStart = (payload) => ({
	type: CREATE_TOURNAMENT_START,
	payload,
});

export const createTournamentSuccess = (payload) => ({
	type: CREATE_TOURNAMENT_SUCCESS,
	payload,
});

export const createTournamentFail = (payload) => ({
	type: CREATE_TOURNAMENT_FAIL,
	payload,
});

export const updateTournamentStart = (payload) => ({
	type: UPDATE_TOURNAMENT_START,
	payload,
});

export const updateTournamentSuccess = (payload) => ({
	type: UPDATE_TOURNAMENT_SUCCESS,
	payload,
});

export const updateTournamentFail = (payload) => ({
	type: UPDATE_TOURNAMENT_FAIL,
	payload,
});

export const getTournamentDetailsStart = (payload) => ({
	type: GET_TOURNAMENT_DETAILS_START,
	payload,
});

export const getTournamentDetailsSuccess = (payload) => ({
	type: GET_TOURNAMENT_DETAILS_SUCCESS,
	payload,
});

export const getTournamentDetailsFail = (payload) => ({
	type: GET_TOURNAMENT_DETAILS_FAIL,
	payload,
});

export const getTournamentDetailByIdStart = (payload) => ({
	type: GET_TOURNAMENT_DETAIL_BY_ID_START,
	payload,
});

export const getTournamentDetailByIdSuccess = (payload) => ({
	type: GET_TOURNAMENT_DETAIL_BY_ID_SUCCESS,
	payload,
});

export const getTournamentDetailByIdFail = (payload) => ({
	type: GET_TOURNAMENT_DETAIL_BY_ID_FAIL,
	payload,
});

export const resetTournamentDetail = (payload) => ({
	type: RESET_TOURNAMENT_DETAIL_START,
	payload,
});

export const getTournamentLeaderBoardDetailStart = (payload) => ({
	type: GET_TOURNAMENT_LEADERBOARD_DETAIL_START,
	payload,
});

export const getTournamentLeaderBoardDetailSuccess = (payload) => ({
	type: GET_TOURNAMENT_LEADERBOARD_DETAIL_SUCCESS,
	payload,
});

export const getTournamentLeaderBoardDetailFail = (payload) => ({
	type: GET_TOURNAMENT_LEADERBOARD_DETAIL_FAIL,
	payload,
});

export const updateTournamentStatusStart = (payload) => ({
	type: UPDATE_TOURNAMENT_STATUS_START,
	payload,
});

export const updateTournamentStatusSuccess = (payload) => ({
	type: UPDATE_TOURNAMENT_STATUS_SUCCESS,
	payload,
});

export const updateTournamentStatusFail = (payload) => ({
	type: UPDATE_TOURNAMENT_STATUS_FAIL,
	payload,
});

export const getTournamentTransactionStart = (payload) => ({
	type: GET_TOURNAMENT_TRANSACTIONS_START,
	payload,
});

export const getTournamentTransactionSuccess = (payload) => ({
	type: GET_TOURNAMENT_TRANSACTIONS_SUCCESS,
	payload,
});

export const getTournamentTransactionFail = (payload) => ({
	type: GET_TOURNAMENT_TRANSACTIONS_FAIL,
	payload,
});
