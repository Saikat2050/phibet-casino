import {
	CREATE_TOURNAMENT_FAIL,
	CREATE_TOURNAMENT_START,
	CREATE_TOURNAMENT_SUCCESS,
	GET_TOURNAMENT_DETAILS_FAIL,
	GET_TOURNAMENT_DETAILS_START,
	GET_TOURNAMENT_DETAILS_SUCCESS,
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

const initialState = {
	createTournament: false,
	isCreateTournamentLoading: false,
	iscreateTournamentError: null,
	tournamentsInfo: null,
	isTournamentsInfoLoading: false,
	isTournamentsInfoError: null,
	tournamentDetail: null,
	tournamentSegmentDetail: null,
	tournamentDetailLoading: false,
	isTournamentDetailError: null,
	updateTournament: false,
	isUpdateTournamentLoading: false,
	updateTournamentError: null,
	leaderBoardInfo: null,
	leaderBoardLoading: false,
	leaderBoardError: null,
	tournamentLoading: false,
	tournamentError: null,
	tournamentStatusLoading: false,
	tournamentStatusError: null,
	tournamentTransactions: null,
	tournamentTransactionsLoading: false,
	tournamentTransactionsError: null,
};

const EliteQuestData = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case CREATE_TOURNAMENT_START:
			return {
				...state,
				isCreateTournamentLoading: true,
				createTournament: null,
				iscreateTournamentError: null,
			};

		case CREATE_TOURNAMENT_SUCCESS:
			return {
				...state,
				isCreateTournamentLoading: false,
				createTournament: payload,
				iscreateTournamentError: null,
			};

		case CREATE_TOURNAMENT_FAIL:
			return {
				...state,
				isCreateTournamentLoading: false,
				createTournament: null,
				iscreateTournamentError: payload,
			};

		case UPDATE_TOURNAMENT_START:
			return {
				...state,
				isUpdateTournamentLoading: true,
				updateTournament: false,
				updateTournamentError: null,
			};

		case UPDATE_TOURNAMENT_SUCCESS:
			return {
				...state,
				isUpdateTournamentLoading: false,
				updateTournament: true,
				updateTournamentError: null,
			};

		case UPDATE_TOURNAMENT_FAIL:
			return {
				...state,
				isUpdateTournamentLoading: false,
				updateTournament: false,
				updateTournamentError: payload,
			};

		case GET_TOURNAMENT_DETAILS_START:
			return {
				...state,
				isTournamentsInfoLoading: true,
				isTournamentsInfoError: null,
				tournamentsInfo: null,
			};

		case GET_TOURNAMENT_DETAILS_SUCCESS:
			return {
				...state,
				isTournamentsInfoLoading: false,
				isTournamentsInfoError: null,
				tournamentsInfo: payload,
			};

		case GET_TOURNAMENT_DETAILS_FAIL:
			return {
				...state,
				isTournamentsInfoLoading: false,
				isTournamentsInfoError: payload,
				tournamentsInfo: null,
			};

		case GET_TOURNAMENT_DETAIL_BY_ID_START:
			return {
				...state,
				tournamentDetailLoading: true,
				isTournamentDetailError: null,
				tournamentDetail: null,
			};

		case GET_TOURNAMENT_DETAIL_BY_ID_SUCCESS:
			return {
				...state,
				tournamentDetailLoading: false,
				isTournamentDetailError: null,
				tournamentDetail: payload?.tournament,
				tournamentSegmentDetail: payload?.tags,
			};

		case GET_TOURNAMENT_DETAIL_BY_ID_FAIL:
			return {
				...state,
				tournamentDetailLoading: false,
				isTournamentDetailError: payload,
				tournamentDetail: null,
			};

		case RESET_TOURNAMENT_DETAIL_START:
			return {
				...state,
				tournamentDetail: null,
			};

		case GET_TOURNAMENT_LEADERBOARD_DETAIL_START:
			return {
				...state,
				leaderBoardLoading: true,
				leaderBoardError: null,
			};

		case GET_TOURNAMENT_LEADERBOARD_DETAIL_SUCCESS:
			return {
				...state,
				leaderBoardLoading: false,
				leaderBoardInfo: payload,
				leaderBoardError: null,
			};

		case GET_TOURNAMENT_LEADERBOARD_DETAIL_FAIL:
			return {
				...state,
				ileaderBoardLoading: false,
				leaderBoardInfo: null,
				leaderBoardError: payload,
			};

		case UPDATE_TOURNAMENT_STATUS_START:
			return {
				...state,
				tournamentStatusLoading: true,
				tournamentStatusError: null,
			};

		case UPDATE_TOURNAMENT_STATUS_SUCCESS:
			return {
				...state,
				tournamentStatusLoading: false,
				tournamentStatusError: null,
			};

		case UPDATE_TOURNAMENT_STATUS_FAIL:
			return {
				...state,
				tournamentStatusLoading: false,
				tournamentStatusError: payload,
			};

		case GET_TOURNAMENT_TRANSACTIONS_START:
			return {
				...state,
				tournamentTransactionsLoading: true,
				tournamentTransactionsError: null,
			};

		case GET_TOURNAMENT_TRANSACTIONS_SUCCESS:
			return {
				...state,
				tournamentTransactionsLoading: false,
				tournamentTransactions: payload,
				tournamentTransactionsError: null,
			};

		case GET_TOURNAMENT_TRANSACTIONS_FAIL:
			return {
				...state,
				tournamentTransactionsLoading: false,
				tournamentTransactions: null,
				tournamentTransactionsError: payload,
			};

		default:
			return { ...state };
	}
};

export default EliteQuestData;
