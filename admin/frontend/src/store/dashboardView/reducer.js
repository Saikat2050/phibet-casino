import {
	GET_DEMOGRAPHIC_START,
	GET_DEMOGRAPHIC_SUCCESS,
	GET_DEMOGRAPHIC_FAIL,
	GET_KPI_REPORT_START,
	GET_KPI_REPORT_SUCCESS,
	GET_KPI_REPORT_FAIL,
	RESET_DASHBOARD_STATE,
	GET_GAME_REPORT_SUCCESS,
	GET_GAME_REPORT_START,
	GET_GAME_REPORT_FAIL,
	GET_KPI_SUMMARY_START,
	GET_KPI_SUMMARY_SUCCESS,
	GET_TOP_PLAYERS_START,
	GET_TOP_PLAYERS_SUCCESS,
	GET_TOP_PLAYERS_FAIL,
	GET_STATS_START,
	GET_STATS_SUCCESS,
	PLAYER_INFO,
	PLAYER_INFO_SUCCESS,
	GET_GAME_PLAYER_COUNT_START,
	GET_GAME_PLAYER_COUNT_SUCCESS,
	GET_GAME_PLAYER_COUNT_FAIL,
	GET_STATISTICS_SUMMARY_V2_START,
	GET_STATISTICS_SUMMARY_V2_SUCCESS,
	GET_STATISTICS_SUMMARY_V2_FAIL,
	GET_ACTIVE_USERS_START,
	GET_ACTIVE_USERS_SUCCESS,
	GET_ACTIVE_USERS_FAIL,
	GET_BONUS_REPORT_START,
	GET_BONUS_REPORT_SUCCESS,
	GET_BONUS_REPORT_FAIL
} from './actionTypes';

const INIT_STATE = {
	isDemographicLoading: false,
	demoGraphicData: {},
	kPISummary: null,
	isKpiSummaryLoading: false,
	isKpiSummaryError: null,
	kPIReport: null,
	isKpiReportLoading: false,
	isKpiReportError: null,
	gameReport: null,
	isGameReportLoading: false,
	isGameReportError: false,
	topPlayers: null,
	topPlayersLoading: false,
	topPlayersError: null,
	statsDataLoading: false,
	statsData: null,
	playerInfoLoading: false,
	playerInfo: null,
	gamePlayerCount: {},
	isGamePlayerCountLoading: false,
	gamePlayerCountError: null,
	statisticsV2Data: null,
	statisticsV2Loading: false,
	statisticsV2Error: null,
	activeUsers: [],
	isActiveUsersLoading: false,
	activeUsersError: null,
	bonusReportLoading: false,
	bonusReport: null,
	bonusReportError: null
};

function DashboardView(state = INIT_STATE, { type, payload } = {}) {
	switch (type) {
		case GET_STATS_START:
			return {
				...state,
				statsDataLoading: true,
			};

		case GET_STATS_SUCCESS:
			return {
				...state,
				statsDataLoading: false,
				statsData: payload,
			};

		case PLAYER_INFO:
			return {
				...state,
				playerInfoLoading: true,
			};

		case PLAYER_INFO_SUCCESS:
			return {
				...state,
				playerInfoLoading: false,
				playerInfo: payload,
			};

		case GET_DEMOGRAPHIC_START:
			return {
				...state,
				isDemographicLoading: true,
				demoGraphicData: {},
			};

		case GET_DEMOGRAPHIC_SUCCESS:
			return {
				...state,
				isDemographicLoading: false,
				demoGraphicData: payload,
			};

		case GET_DEMOGRAPHIC_FAIL:
			return {
				...state,
				isDemographicLoading: false,
				demoGraphicData: {},
			};
		case GET_KPI_REPORT_START:
			return {
				...state,
				isKpiReportLoading: true,
				kPIReport: null,
				isKpiReportError: null,
			};

		case GET_KPI_REPORT_SUCCESS:
			return {
				...state,
				isKpiReportLoading: false,
				kPIReport: payload,
				isKpiReportError: null,
			};

		case GET_KPI_REPORT_FAIL:
			return {
				...state,
				isKpiReportLoading: false,
				kPIReport: null,
				isKpiReportError: payload,
			};

		case GET_GAME_REPORT_START:
			return {
				...state,
				isGameReportLoading: true,
				gameReport: null,
				isGameReportError: false,
			};

		case GET_GAME_REPORT_SUCCESS:
			return {
				...state,
				isGameReportLoading: false,
				gameReport: payload,
				isGameReportError: false,
				gamePlayerCount: {},
			};

		case GET_GAME_REPORT_FAIL:
			return {
				...state,
				isGameReportLoading: false,
				gameReport: null,
				isGameReportError: true,
			};

		case GET_KPI_SUMMARY_START:
			return {
				...state,
				isKpiSummaryLoading: true,
				kPISummary: null,
				isKpiSummaryError: null,
			};

		case GET_KPI_SUMMARY_SUCCESS:
			return {
				...state,
				isKpiSummaryLoading: false,
				kPISummary: payload,
				isKpiSummaryError: null,
			};

		case GET_TOP_PLAYERS_START:
			return {
				...state,
				topPlayersLoading: true,
				topPlayersError: '',
			};
		case GET_TOP_PLAYERS_SUCCESS:
			return {
				...state,
				topPlayersLoading: false,
				topPlayers: payload,
				topPlayersError: '',
			};
		case GET_TOP_PLAYERS_FAIL:
			return {
				...state,
				topPlayersLoading: false,
				topPlayersError: payload,
			};
		case GET_BONUS_REPORT_START:
			return {
				...state,
				bonusReportLoading: true,
				bonusReportError: '',
			};
		case GET_BONUS_REPORT_SUCCESS:
			return {
				...state,
				bonusReportLoading: false,
				bonusReport: payload,
				bonusReportError: '',
			};
		case GET_BONUS_REPORT_FAIL:
			return {
				...state,
				bonusReportLoading: false,
				bonusReportError: payload,
			};
		case GET_GAME_PLAYER_COUNT_START:
			return {
				...state,
				isGamePlayerCountLoading: true,
				gamePlayerCount: {
					...state.gamePlayerCount,
					[payload.id]: {
						...state.gamePlayerCount?.[payload.id],
						isLoading: true,
					},
				},
				gamePlayerCountError: null,
			};

		case GET_GAME_PLAYER_COUNT_SUCCESS:
			return {
				...state,
				isGamePlayerCountLoading: false,
				gamePlayerCount: {
					...state.gamePlayerCount,
					[payload.id]: {
						count: payload.distinctPlayerCount,
						isLoading: false,
					},
				},
			};

		case GET_GAME_PLAYER_COUNT_FAIL:
			return {
				...state,
				isGamePlayerCountLoading: false,
				gamePlayerCount: {
					...state.gamePlayerCount,
					[payload.id]: {
						...state.gamePlayerCount?.[payload.id],
						isLoading: false,
						error: payload,
					},
				},
			};

		case GET_STATISTICS_SUMMARY_V2_START:
			return {
				...state,
				statisticsV2Loading: true,
				statisticsV2Error: null,
			};

		case GET_STATISTICS_SUMMARY_V2_SUCCESS:
			return {
				...state,
				statisticsV2Data: payload,
				statisticsV2Loading: false,
			};

		case GET_STATISTICS_SUMMARY_V2_FAIL:
			return {
				...state,
				statisticsV2Loading: false,
				statisticsV2Error: payload,
			};

		case GET_ACTIVE_USERS_START:
			return {
				...state,
				isActiveUsersLoading: true,
				activeUsersError: null,
			};
		case GET_ACTIVE_USERS_SUCCESS:
			return {
				...state,
				activeUsers: payload,
				isActiveUsersLoading: false,
				activeUsersError: null,
			};
		case GET_ACTIVE_USERS_FAIL:
			return {
				...state,
				activeUsersError: payload,
				isActiveUsersLoading: false,
			};

		case RESET_DASHBOARD_STATE:
			return INIT_STATE;
		default:
			return state;
	}
}

export default DashboardView;
