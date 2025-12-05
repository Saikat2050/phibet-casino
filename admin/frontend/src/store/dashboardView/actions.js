import {
	GET_DEMOGRAPHIC_START,
	GET_DEMOGRAPHIC_SUCCESS,
	GET_DEMOGRAPHIC_FAIL,
	GET_KPI_REPORT_START,
	GET_KPI_REPORT_SUCCESS,
	GET_KPI_REPORT_FAIL,
	GET_GAME_REPORT_FAIL,
	GET_GAME_REPORT_START,
	GET_GAME_REPORT_SUCCESS,
	GET_KPI_SUMMARY_START,
	GET_KPI_SUMMARY_SUCCESS,
	GET_KPI_SUMMARY_FAIL,
	GET_TOP_PLAYERS_START,
	GET_TOP_PLAYERS_SUCCESS,
	GET_TOP_PLAYERS_FAIL,
	GET_STATS_START,
	GET_STATS_SUCCESS,
	GET_STATS_FAIL,
	PLAYER_INFO,
	PLAYER_INFO_SUCCESS,
	PLAYER_INFO_FAIL,
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
	GET_BONUS_REPORT_FAIL,
} from './actionTypes';

export const getStatisticData = (payload) => ({
	type: GET_STATS_START,
	payload,
});

export const getStatisticDataSuccess = (payload) => ({
	type: GET_STATS_SUCCESS,
	payload,
});

export const getStatisticDataFail = (payload) => ({
	type: GET_STATS_FAIL,
	payload,
});

export const getPlayersInfo = (payload) => ({
	type: PLAYER_INFO,
	payload,
});

export const getPlayersInfoSuccess = (payload) => ({
	type: PLAYER_INFO_SUCCESS,
	payload,
});

export const getPlayersInfoFail = (payload) => ({
	type: PLAYER_INFO_FAIL,
	payload,
});

export const getDemographicStart = (payload) => ({
	type: GET_DEMOGRAPHIC_START,
	payload,
});

export const getDemographicSuccess = (payload) => ({
	type: GET_DEMOGRAPHIC_SUCCESS,
	payload,
});

export const getDemographicFail = (payload) => ({
	type: GET_DEMOGRAPHIC_FAIL,
	payload,
});

export const getKpiReportStart = (payload) => ({
	type: GET_KPI_REPORT_START,
	payload,
});

export const getKpiReportSuccess = (payload) => ({
	type: GET_KPI_REPORT_SUCCESS,
	payload,
});

export const getKpiReportFail = (payload) => ({
	type: GET_KPI_REPORT_FAIL,
	payload,
});

export const getGameReportStart = (payload) => ({
	type: GET_GAME_REPORT_START,
	payload,
});

export const getGameReportSuccess = (payload) => ({
	type: GET_GAME_REPORT_SUCCESS,
	payload,
});

export const getGameReportFail = (payload) => ({
	type: GET_GAME_REPORT_FAIL,
	payload,
});

export const getKpiSummaryStart = (payload) => ({
	type: GET_KPI_SUMMARY_START,
	payload,
});

export const getKpiSummarySuccess = (payload) => ({
	type: GET_KPI_SUMMARY_SUCCESS,
	payload,
});

export const getKpiSummaryFail = (payload) => ({
	type: GET_KPI_SUMMARY_FAIL,
	payload,
});

export const getTopPlayers = (payload) => ({
	type: GET_TOP_PLAYERS_START,
	payload,
});

export const getTopPlayersSuccess = (payload) => ({
	type: GET_TOP_PLAYERS_SUCCESS,
	payload,
});

export const getTopPlayersFail = (payload) => ({
	type: GET_TOP_PLAYERS_FAIL,
	payload,
});

export const getBonusReport = (payload) => ({
	type: GET_BONUS_REPORT_START,
	payload,
});

export const getBonusReportSuccess = (payload) => ({
	type: GET_BONUS_REPORT_SUCCESS,
	payload,
});

export const getBonusReportFail = (payload) => ({
	type: GET_BONUS_REPORT_FAIL,
	payload,
});

export const getGamePlayerCountStart = (payload) => ({
	type: GET_GAME_PLAYER_COUNT_START,
	payload,
});

export const getGamePlayerCountSuccess = (payload) => ({
	type: GET_GAME_PLAYER_COUNT_SUCCESS,
	payload,
});

export const getGamePlayerCountFail = (payload) => ({
	type: GET_GAME_PLAYER_COUNT_FAIL,
	payload,
});

export const getStatisticsSummaryV2Start = (payload) => ({
	type: GET_STATISTICS_SUMMARY_V2_START,
	payload,
});

export const getStatisticsSummaryV2Success = (payload) => ({
	type: GET_STATISTICS_SUMMARY_V2_SUCCESS,
	payload,
});

export const getStatisticsSummaryV2Fail = (payload) => ({
	type: GET_STATISTICS_SUMMARY_V2_FAIL,
	payload,
});

export const getActiveUsersStart = (payload) => ({
	type: GET_ACTIVE_USERS_START,
	payload,
});

export const getActiveUsersSuccess = (payload) => ({
	type: GET_ACTIVE_USERS_SUCCESS,
	payload,
});

export const getActiveUsersFail = (error) => ({
	type: GET_ACTIVE_USERS_FAIL,
	payload: error,
});
