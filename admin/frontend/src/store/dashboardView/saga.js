/* eslint-disable eqeqeq */
import { put, takeEvery, all, fork } from 'redux-saga/effects';

// Crypto Redux States
import {
	GET_DEMOGRAPHIC_START,
	GET_KPI_REPORT_START,
	GET_GAME_REPORT_START,
	GET_KPI_SUMMARY_START,
	GET_TOP_PLAYERS_START,
	GET_STATS_START,
	PLAYER_INFO,
	GET_GAME_PLAYER_COUNT_START,
	GET_STATISTICS_SUMMARY_V2_START,
	GET_ACTIVE_USERS_START,
	GET_BONUS_REPORT_START,
} from './actionTypes';
import {
	getDemographicSuccess,
	getDemographicFail,
	// getKpiReportStart,
	getKpiReportSuccess,
	getKpiReportFail,
	getGameReportSuccess,
	getGameReportFail,
	getKpiSummarySuccess,
	getKpiSummaryFail,
	getTopPlayersSuccess,
	getTopPlayersFail,
	getStatisticDataSuccess,
	getStatisticDataFail,
	getPlayersInfoSuccess,
	getPlayersInfoFail,
	getGamePlayerCountSuccess,
	getGamePlayerCountFail,
	getStatisticsSummaryV2Success,
	getStatisticsSummaryV2Fail,
	getActiveUsersSuccess,
	getActiveUsersFail,
	getBonusReportSuccess,
	getBonusReportFail,
} from './actions';
import {
	getActiveUsers,
	getBonusReportCall,
	getDashboardDemoGraphicService,
	getGamePlayerCount,
	getGameReports,
	getKpiReport,
	getKpiSummary,
	getStatisticsSummaryV2,
	getTopPlayersRequest,
	playerInfoRequest,
	statsDataRequest,
} from '../../network/getRequests';

// const cumulativeDataOfAllCurrencies = (records) => {
// 	const groupedByDates = groupBy(records, 'date');
// 	const cumulativeCurrencyData = Object.entries(groupedByDates).map(
// 		([date, values]) =>
// 			values.reduce(
// 				(acc, cur) => {
// 					if (cur?.currency_id == 1) return acc; // Skipped the GC coins

// 					acc.active_users_count += Number(cur.active_users_count || 0);
// 					acc.purchase_count += Number(cur.purchase_count || 0);
// 					acc.redeem_count += Number(cur.redeem_count || 0);
// 					acc.casino_bet_count += Number(cur.casino_bet_count || 0);
// 					acc.casino_win_count += Number(cur.casino_win_count || 0);

// 					acc.total_purchase_amount += parseFloat(
// 						cur.total_purchase_amount || 0
// 					);
// 					acc.total_redeem_amount += parseFloat(cur.total_redeem_amount || 0);
// 					acc.total_casino_bet_amount += parseFloat(
// 						cur.total_casino_bet_amount || 0
// 					);
// 					acc.total_casino_win_amount += parseFloat(
// 						cur.total_casino_win_amount || 0
// 					);
// 					acc.total_tournament_buy += parseFloat(cur.total_tournament_buy || 0);
// 					acc.total_tournament_win += parseFloat(cur.total_tournament_win || 0);

// 					return acc;
// 				},
// 				{
// 					date,
// 					active_users_count: 0,
// 					purchase_count: 0,
// 					redeem_count: 0,
// 					casino_bet_count: 0,
// 					casino_win_count: 0,
// 					total_purchase_amount: 0,
// 					total_redeem_amount: 0,
// 					total_casino_bet_amount: 0,
// 					total_casino_win_amount: 0,
// 					total_tournament_buy: 0,
// 					total_tournament_win: 0,
// 				}
// 			)
// 	);

// 	return sortBy(cumulativeCurrencyData, 'date');
// };

const formDataChunks = (data, desiredLength) => {
	try {
		const totalDataPoints = data.length;
		const rangeSize = Math.ceil(totalDataPoints / desiredLength);

		const summarizedData = [];
		for (let i = 0; i < totalDataPoints; i += rangeSize) {
			const rangeEnd = Math.min(i + rangeSize, totalDataPoints);

			const summary = {
				start_date: data[i].date,
				end_date: data[rangeEnd - 1].date,
				active_users_count: 0,
				gc_purchase_count: 0,
				gc_redeem_count: 0,
				gc_total_purchase_amount: 0,
				gc_total_redeem_amount: 0,
				gc_casino_bet_count: 0,
				gc_casino_win_count: 0,
				gc_total_casino_bet_amount: 0,
				gc_total_casino_win_amount: 0,
				gc_total_tournament_buy: 0,
				gc_total_tournament_win: 0,
				sc_purchase_count: 0,
				sc_redeem_count: 0,
				sc_total_purchase_amount: 0,
				sc_total_redeem_amount: 0,
				sc_casino_bet_count: 0,
				sc_casino_win_count: 0,
				sc_total_casino_bet_amount: 0,
				sc_total_casino_win_amount: 0,
				sc_total_tournament_buy: 0,
				sc_total_tournament_win: 0,
			};

			for (let j = i; j < rangeEnd; j += 1) {
				summary.active_users_count += Number(data[j].active_users_count || 0);
				summary.gc_purchase_count += parseFloat(data[j].gc_purchase_count || 0);
				summary.gc_redeem_count += parseFloat(data[j].gc_redeem_count || 0);
				summary.gc_total_purchase_amount += parseFloat(
					data[j].gc_total_purchase_amount || 0
				);
				summary.gc_total_redeem_amount += parseFloat(
					data[j].gc_total_redeem_amount || 0
				);
				summary.gc_casino_bet_count += parseFloat(
					data[j].gc_casino_bet_count || 0
				);
				summary.gc_casino_win_count += parseFloat(
					data[j].gc_casino_win_count || 0
				);
				summary.gc_total_casino_bet_amount += parseFloat(
					data[j].gc_total_casino_bet_amount || 0
				);
				summary.gc_total_casino_win_amount += parseFloat(
					data[j].gc_total_casino_win_amount || 0
				);
				summary.gc_total_tournament_buy += parseFloat(
					data[j].gc_total_tournament_buy || 0
				);
				summary.gc_total_tournament_win += parseFloat(
					data[j].gc_total_tournament_win || 0
				);
				summary.sc_purchase_count += parseFloat(data[j].sc_purchase_count || 0);
				summary.sc_redeem_count += parseFloat(data[j].sc_redeem_count || 0);
				summary.sc_total_purchase_amount += parseFloat(
					data[j].sc_total_purchase_amount || 0
				);
				summary.sc_total_redeem_amount += parseFloat(
					data[j].sc_total_redeem_amount || 0
				);
				summary.sc_casino_bet_count += parseFloat(
					data[j].sc_casino_bet_count || 0
				);
				summary.sc_casino_win_count += parseFloat(
					data[j].sc_casino_win_count || 0
				);
				summary.sc_total_casino_bet_amount += parseFloat(
					data[j].sc_total_casino_bet_amount || 0
				);
				summary.sc_total_casino_win_amount += parseFloat(
					data[j].sc_total_casino_win_amount || 0
				);
				summary.sc_total_tournament_buy += parseFloat(
					data[j].sc_total_tournament_buy || 0
				);
				summary.sc_total_tournament_win += parseFloat(
					data[j].sc_total_tournament_win || 0
				);
			}

			summarizedData.push(summary);
		}

		return summarizedData;
	} catch (err) {
		return data.slice(-1 * desiredLength);
	}
};

function* getStatsDataWorker({ payload }) {
	try {
		const { data } = yield statsDataRequest(payload);
		// const cumulativeCurrencyData = cumulativeDataOfAllCurrencies(
		// 	data?.data?.stats || []
		// );
		const groupedData = formDataChunks(data?.data?.stats || [], 10);
		yield put(
			getStatisticDataSuccess({
				...(data?.data || {}),
				grouped: groupedData,
			})
		);
	} catch (e) {
		yield put(getStatisticDataFail());
	}
}

function* getDemoGraphicData(action) {
	try {
		const { data } = yield getDashboardDemoGraphicService(action.payload);
		yield put(getDemographicSuccess(data?.data));
	} catch (e) {
		yield put(getDemographicFail());
	}
}

function* getPlayersInfoWorker(action) {
	try {
		const { data } = yield playerInfoRequest(action.payload);
		yield put(getPlayersInfoSuccess(data?.data));
	} catch (e) {
		yield put(getPlayersInfoFail());
	}
}

function* getKpiSummaryWorker(action) {
	try {
		const payload = action && action?.payload;
		const { data } = yield getKpiSummary(payload);
		yield put(getKpiSummarySuccess(data?.data?.kpiSummary));
	} catch (e) {
		yield put(getKpiSummaryFail(e?.response?.data?.errors[0]?.description));
	}
}

function* getKpiData(action) {
	try {
		const payload = action && action?.payload;
		const { data } = yield getKpiReport(payload);
		yield put(getKpiReportSuccess(data?.data?.reportData));
	} catch (e) {
		yield put(
			getKpiReportFail(e?.response?.data?.errors[0]?.description || e.message)
		);
	}
}

function* getGameReportWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getGameReports(payload);
		yield put(getGameReportSuccess(data?.data?.gameReport));
	} catch (e) {
		yield put(getGameReportFail(e?.response?.data?.errors[0]?.description));
	}
}

function* topPlayersWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getTopPlayersRequest(payload);
		yield put(getTopPlayersSuccess(data?.data));
	} catch (e) {
		yield put(getTopPlayersFail(e?.response?.data?.errors[0]?.description));
	}
}

function* getGamePlayerCountWorker({ payload }) {
	try {
		const { data } = yield getGamePlayerCount(payload);
		yield put(
			getGamePlayerCountSuccess({
				distinctPlayerCount: data?.data?.distinctplayercount,
				id: payload?.id,
			})
		);
	} catch (e) {
		yield put(
			getGamePlayerCountFail(e?.response?.data?.errors[0]?.description)
		);
	}
}

function* getStatisticsSummaryV2Worker({ payload }) {
	try {
		const { data } = yield getStatisticsSummaryV2(payload);
		yield put(getStatisticsSummaryV2Success(data?.data));
	} catch (error) {
		yield put(getStatisticsSummaryV2Fail(error));
	}
}

function* getActiveUsersSaga({ payload }) {
	try {
		const { data } = yield getActiveUsers(payload);
		yield put(getActiveUsersSuccess(data?.data));
	} catch (error) {
		yield put(getActiveUsersFail(error));
	}
}

function* getBonusReportWorker({ payload }) {
	try {
		const { data } = yield getBonusReportCall(payload);
		yield put(getBonusReportSuccess(data?.data));
	} catch (error) {
		yield put(getBonusReportFail(error));
	}
}

export function* watchDashboardViewData() {
	yield takeEvery(GET_STATS_START, getStatsDataWorker);
	yield takeEvery(PLAYER_INFO, getPlayersInfoWorker);
	yield takeEvery(GET_DEMOGRAPHIC_START, getDemoGraphicData);
	yield takeEvery(GET_KPI_REPORT_START, getKpiData);
	yield takeEvery(GET_GAME_REPORT_START, getGameReportWorker);
	yield takeEvery(GET_KPI_SUMMARY_START, getKpiSummaryWorker);
	yield takeEvery(GET_TOP_PLAYERS_START, topPlayersWorker);
	yield takeEvery(GET_GAME_PLAYER_COUNT_START, getGamePlayerCountWorker);
	yield takeEvery(
		GET_STATISTICS_SUMMARY_V2_START,
		getStatisticsSummaryV2Worker
	);
	yield takeEvery(GET_ACTIVE_USERS_START, getActiveUsersSaga);
	yield takeEvery(GET_BONUS_REPORT_START, getBonusReportWorker);
}

function* dashboardSaga() {
	yield all([fork(watchDashboardViewData)]);
}

export default dashboardSaga;
