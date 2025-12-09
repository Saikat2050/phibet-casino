/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable camelcase */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ReportList from './ReportList';
import { getPercentage } from '../../../utils/helpers';
import Spinners from '../../../components/Common/Spinner';

const LivePlayerReport = () => {
	const {
		statisticsV2Data,
		statisticsV2Loading,
		activeUsers,
		activeUsersLoading,
	} = useSelector((state) => state.DashboardViewInfo);

	const today = moment().format('YYYY-MM-DD');
	const todayPlayerReportData = activeUsers?.find(
		(item) => moment(item.date).format('YYYY-MM-DD') === today
	);

	const performanceReports = useMemo(() => {
		if (!statisticsV2Data?.performanceReportData) return [];

		const performanceData = [...statisticsV2Data.performanceReportData];

		if (statisticsV2Data.missingData?.[0]) {
			const lastIndex = performanceData.length - 1;
			const lastEntry = performanceData[lastIndex];
			const missingData = statisticsV2Data.missingData[0];

			const updatedEntry = Object.keys(missingData).reduce(
				(acc, key) => {
					const lastValue = Number(lastEntry[key]) || 0;
					const missingValue = Number(missingData[key]) || 0;
					return { ...acc, [key]: lastValue + missingValue };
				},
				{ ...lastEntry }
			);

			performanceData[lastIndex] = updatedEntry;
		}

		const sortedPerformanceData = [
			...statisticsV2Data.performanceReportData,
		].sort((a, b) => moment(a.report_day).diff(moment(b.report_day)));

		const todayData = statisticsV2Data?.todayReportData?.[0];
		const todayWalletsData = statisticsV2Data.walletsSCData;

		// const todayDate = moment().format('YYYY-MM-DD');
		// const todayData =
		// 	performanceData.find(
		// 		(item) => moment(item.report_day).format('YYYY-MM-DD') === todayDate
		// 	) || {};

		return [
			{
				title: 'Staked',
				tooltip: 'Staked',
				toolTipId: 'Staked',
				value: Number(
					(
						(todayData?.sc_total_bet_amount || 0) -
						(todayData?.sc_casino_bet_rollback || 0)
					)?.toFixed(2)
				),
				diff() {
					const dataList = this.series?.[0]?.data || [];
					return getPercentage(dataList.at(-1), dataList?.at(0));
				},
				series: [
					{
						name: 'Staked',
						data: sortedPerformanceData?.map((item) =>
							Number(
								(
									(item?.sc_total_bet_amount || 0) -
									(item?.sc_casino_bet_rollback || 0)
								)?.toFixed(2)
							)
						),
					},
				],
			},
			{
				title: 'Wins',
				tooltip: 'Wind',
				toolTipId: 'scWins',
				value: Number(
					(
						(todayData?.sc_total_win_amount || 0) -
						(todayData?.sc_casino_win_rollback || 0)
					)?.toFixed(2)
				),
				diff() {
					const dataList = this.series?.[0]?.data || [];
					return getPercentage(dataList.at(-1), dataList?.at(0));
				},
				series: [
					{
						name: 'Wins',
						data: sortedPerformanceData?.map((item) =>
							Number(
								(
									(item?.sc_total_win_amount || 0) -
									(item?.sc_casino_win_rollback || 0)
								)?.toFixed(2)
							)
						),
					},
				],
			},
			{
				title: 'GGR',
				tooltip: 'GGR',
				toolTipId: 'ggr',
				value: Number(
					(
						(todayData?.sc_total_bet_amount || 0) -
						(todayData?.sc_casino_bet_rollback || 0) -
						((todayData?.sc_total_win_amount || 0) -
							(todayData?.sc_casino_win_rollback || 0))
					)?.toFixed(2)
				),
				diff() {
					const dataList = this.series?.[0]?.data || [];
					return getPercentage(dataList.at(-1), dataList?.at(0));
				},
				series: [
					{
						name: 'GGR',
						data: sortedPerformanceData.map((item) =>
							Number(
								(
									(item?.sc_total_bet_amount || 0) -
									(item?.sc_casino_bet_rollback || 0) -
									((item?.sc_total_win_amount || 0) -
										(item?.sc_casino_win_rollback || 0))
								)?.toFixed(2)
							)
						),
					},
				],
			},
			{
				title: 'Net GGR',
				tooltip: 'Net GGR',
				toolTipId: 'netGGR',
				value: Number(
					(
						(todayData?.sc_total_bet_amount || 0) -
						(todayData?.sc_casino_bet_rollback || 0) -
						((todayData?.sc_total_win_amount || 0) -
							(todayData?.sc_casino_win_rollback || 0)) +
						((todayData?.gc_total_bet_amount || 0) -
							(todayData?.gc_casino_bet_rollback || 0) -
							((todayData?.gc_total_win_amount || 0) -
								(todayData?.gc_casino_win_rollback || 0)))
					)?.toFixed(2)
				),
				diff() {
					const dataList = this.series?.[0]?.data || [];
					return getPercentage(dataList.at(-1), dataList?.at(0));
				},
				series: [
					{
						name: 'Net GGR',
						data: sortedPerformanceData.map((item) => {
							const scNet =
								(item?.sc_total_bet_amount || 0) -
								(item?.sc_casino_bet_rollback || 0) -
								((item?.sc_total_win_amount || 0) -
									(item?.sc_casino_win_rollback || 0));

							const gcNet =
								(item?.gc_total_bet_amount || 0) -
								(item?.gc_casino_bet_rollback || 0) -
								((item?.gc_total_win_amount || 0) -
									(item?.gc_casino_win_rollback || 0));

							return Number((scNet + gcNet).toFixed(2));
						}),
					},
				],
			},
			{
				title: 'Online Players',
				tooltip: 'Online Players',
				toolTipId: 'onlinePlayers',
				value: statisticsV2Data?.onlinePlayers ?? 0,

				diff() {},
				series: [],
			},
			{
				title: 'Active Players',
				tooltip: 'Active Players',
				toolTipId: 'activePlayers',
				value: todayPlayerReportData?.active_player ?? 0,
				diff() {
					const dataList = this.series?.[0]?.data || [];
					return getPercentage(dataList.at(-1), dataList?.at(0));
				},
				series: [
					{
						name: 'Active Players',
						data: activeUsers.map((item) => item.active_player || 0),
					},
				],
			},
			{
				title: 'Total Withdrawal',
				tooltip: 'Total Withdrawal',
				toolTipId: 'totalRedeemableSC',
				value: Number((+todayWalletsData?.totalSCAmount || 0)?.toFixed(2)),
				diff() {},
				series: [],
			},
		];
	}, [statisticsV2Data, activeUsers]);

	return statisticsV2Loading || activeUsersLoading ? (
		<Spinners />
	) : (
		<ReportList reports={performanceReports} />
	);
};

export default LivePlayerReport;
