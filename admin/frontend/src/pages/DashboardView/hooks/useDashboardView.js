import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
	getActiveUsersStart,
	getPlayersInfo,
	// getStatisticData,
	getStatisticsSummaryV2Start,
} from '../../../store/dashboardView/actions';
// import getChartColorsArray from '../../../components/Common/ChartsDynamicColor';
import { INITIAL_FILTERS } from '../constant';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	dashboardElements,
	initialElement,
	validationSchema,
} from '../formFields';
import { setItem } from '../../../network/storageUtils';
import { STORAGE_KEY } from '../../../components/Common/constants';
import { YMDdate } from '../../../constants/config';
import { convertToUTC } from '../../../utils/helpers';

const useDashboardView = () => {
	const dispatch = useDispatch();
	const { startUTC, endUTC } = convertToUTC(
		moment(INITIAL_FILTERS.fromDate).format(YMDdate),
		moment(INITIAL_FILTERS.toDate).format(YMDdate),
		INITIAL_FILTERS.timezone
	);

	const [dashFilters, setDashFilters] = useState({
		fromDate: startUTC,
		toDate: endUTC,
		timezone: INITIAL_FILTERS.timezone,
		tagIds: '',
	});

	const { layoutModeType, showRightSidebar } = useSelector(
		(state) => state.Layout
	);

	// const { statsDataLoading, statsData } = useSelector(
	// 	(state) => state.DashboardViewInfo
	// );

	const {
		statisticsV2Data,
		statisticsV2Loading,
		activeUsers,
		activeUsersLoading,
	} = useSelector((state) => state.DashboardViewInfo);

	const handleDashFilters = (values) => {
		setDashFilters(values);
	};

	useEffect(() => {
		dispatch(
			getPlayersInfo({
				fromDate: dashFilters?.fromDate || '',
				toDate: dashFilters?.toDate || '',
				dateOptions: 'custom',
				tagIds: dashFilters?.tagIds || '',
			})
		);

		// dispatch(
		// 	getStatisticData({
		// 		fromDate: moment(dashFilters?.fromDate).format(YMDdate) || '',
		// 		toDate: moment(dashFilters?.toDate).format(YMDdate) || '',
		// 		dateOptions: 'custom',
		// 		timezone: dashFilters?.timezone,
		// 	})
		// );
	}, [
		dashFilters.fromDate,
		dashFilters.toDate,
		dashFilters.timezone,
		dashFilters?.tagIds,
	]);

	const {
		isOpen: showElementControl,
		setIsOpen: setShowElementControl,
		validation,
		formFields,
	} = useForm({
		initialValues: initialElement(),
		validationSchema: validationSchema(),
		staticFormFields: dashboardElements(),
	});

	useEffect(() => {
		setItem(STORAGE_KEY.DASH_CONFIG, JSON.stringify(validation.values));
	}, [validation.values]);

	useEffect(() => {
		dispatch(
			getStatisticsSummaryV2Start({
				fromDate: dashFilters?.fromDate || '',
				toDate: dashFilters?.toDate || '',
				dateOptions: 'custom',
				timezone: dashFilters?.timezone,
				tagIds: dashFilters?.tagIds || '',
			})
		);
		dispatch(
			getActiveUsersStart({
				fromDate: dashFilters?.fromDate || '',
				toDate: dashFilters?.toDate || '',
				dateOptions: 'custom',
				timezone: dashFilters?.timezone,
				tagIds: dashFilters?.tagIds || '',
			})
		);
	}, [
		dashFilters.fromDate,
		dashFilters.toDate,
		dashFilters.timezone,
		dashFilters?.tagIds,
		dispatch,
	]);

	const formattedStats = useMemo(() => {
		if (!statisticsV2Data?.performanceReportData) {
			return {
				dates: [],
				purchaseStats: {
					gcAmount: [],
					gcCount: [],
					scAmount: [],
					scCount: [],
					scRewards: [],
					totalPurchaseAmount: [],
				},
				redeemStats: {
					successAmount: [],
					successCount: [],
					failedAmount: [],
					failedCount: [],
					pendingAmount: [],
					pendingCount: [],
				},
				revenueStats: {
					scWagered: [],
					scPayout: [],
					scRevenue: [],
					gcWagered: [],
					gcPayout: [],
					gcRevenue: [],
				},
				payoutStats: { gcAmount: [], gcCount: [], scAmount: [], scCount: [] },
				wageredStats: { gcAmount: [], gcCount: [], scAmount: [], scCount: [] },
			};
		}

		const combinedData = [...statisticsV2Data.performanceReportData]
			// .map((item) => ({
			// 	date: item.report_day,
			// 	...item,
			// }))
			.sort((a, b) => moment(a.report_day).diff(moment(b.report_day)));

		if (statisticsV2Data.missingData?.[0]) {
			const lastIndex = combinedData.length - 1;
			const lastEntry = combinedData[lastIndex];
			const missingData = statisticsV2Data.missingData[0];

			const updatedEntry = Object.keys(missingData).reduce(
				(acc, key) => {
					const lastValue = Number(lastEntry[key]) || 0;
					const missingValue = Number(missingData[key]) || 0;
					return { ...acc, [key]: lastValue + missingValue };
				},
				{ ...lastEntry }
			);

			combinedData[lastIndex] = updatedEntry;
		}

		const dates = combinedData.map((item) => item.report_day);

		// Create a map of dates to total purchase amounts for easy lookup
		const totalPurchaseMap = {};
		if (
			statisticsV2Data?.totalPurchaseAmount &&
			Array.isArray(statisticsV2Data?.totalPurchaseAmount)
		) {
			statisticsV2Data?.totalPurchaseAmount.forEach((item) => {
				const dateKey = moment(item.date).format('YYYY-MM-DD');
				totalPurchaseMap[dateKey] = Number(
					(item.total_purchase_amount || 0).toFixed(2)
				);
			});
		}

		// Map the total purchase amounts to match the dates from combinedData
		const totalPurchaseAmountArray = combinedData.map((item) => {
			const dateKey = moment(item.report_day).format('YYYY-MM-DD');
			return totalPurchaseMap[dateKey] || 0;
		});

		const purchaseStats = {
			gcAmount: combinedData.map((item) =>
				Number((item.purchase_gc_amount || 0).toFixed(2))
			),
			gcCount: combinedData.map((item) => item.purchase_gc_count || 0),
			scAmount: combinedData.map((item) =>
				Number((item.psc_amount || 0).toFixed(2))
			),
			scCount: combinedData.map((item) => item.psc_count || 0),

			firstPurchaseCount: combinedData.map(
				(item) => item.purchase_gc_count || 0
			),
			totalPurchaseAmount: totalPurchaseAmountArray,
		};

		const redeemStats = {
			successAmount: combinedData.map((item) =>
				Number((item.success_redeem_request_amount || 0).toFixed(2))
			),
			successCount: combinedData.map(
				(item) => item.success_redeem_request_count || 0
			),
			failedAmount: combinedData.map((item) =>
				Number(
					(
						(item.failed_redeem_request_amount || 0) +
						(item.rejected_redeem_request_amount || 0)
					).toFixed(2)
				)
			),
			failedCount: combinedData.map(
				(item) =>
					(item.failed_redeem_request_count || 0) +
					(item.rejected_redeem_request_count || 0)
			),
			pendingAmount: combinedData.map((item) =>
				Number((item.pending_redeem_request_amount || 0).toFixed(2))
			),
			pendingCount: combinedData.map(
				(item) => item.pending_redeem_request_count || 0
			),
		};

		const revenueStats = {
			scWagered: combinedData.map((item) =>
				Number(
					(
						(item.sc_total_bet_amount || 0) - (item.sc_casino_bet_rollback || 0)
					).toFixed(2)
				)
			),
			scPayout: combinedData.map((item) =>
				Number(
					(
						(item.sc_total_win_amount || 0) - (item.sc_casino_win_rollback || 0)
					).toFixed(2)
				)
			),
			scRevenue: combinedData.map((item) =>
				Number(
					(item.sc_total_bet_amount || 0) -
						(item.sc_casino_bet_rollback || 0) -
						((item.sc_total_win_amount || 0) -
							(item.sc_casino_win_rollback || 0))
				).toFixed(2)
			),
			gcWagered: combinedData.map((item) =>
				Number(
					(
						(item.gc_total_bet_amount || 0) - (item.gc_casino_bet_rollback || 0)
					).toFixed(2)
				)
			),
			gcPayout: combinedData.map((item) =>
				Number(
					(
						(item.gc_total_win_amount || 0) - (item.gc_casino_win_rollback || 0)
					).toFixed(2)
				)
			),
			gcRevenue: combinedData.map((item) =>
				Number(
					(item.gc_total_bet_amount || 0) -
						(item.gc_casino_bet_rollback || 0) -
						((item.gc_total_win_amount || 0) -
							(item.gc_casino_win_rollback || 0))
				).toFixed(2)
			),
		};

		const payoutStats = {
			gcAmount: combinedData.map((item) =>
				Number(
					(
						(item.gc_total_win_amount || 0) - (item.gc_casino_win_rollback || 0)
					).toFixed(2)
				)
			),
			gcCount: combinedData.map(
				(item) =>
					(item.gc_total_win_count || 0) -
					(item.gc_casino_win_rollback_count || 0)
			),
			scAmount: combinedData.map((item) =>
				Number(
					(
						(item.sc_total_win_amount || 0) - (item.sc_casino_win_rollback || 0)
					).toFixed(2)
				)
			),
			scCount: combinedData.map(
				(item) =>
					(item.sc_total_win_count || 0) -
					(item.sc_casino_win_rollback_count || 0)
			),
		};

		const wageredStats = {
			gcAmount: combinedData.map((item) =>
				Number(
					(
						(item.gc_total_bet_amount || 0) - (item.gc_casino_bet_rollback || 0)
					).toFixed(2)
				)
			),
			gcCount: combinedData.map(
				(item) =>
					(item.gc_total_bet_count || 0) -
					(item.gc_casino_bet_rollback_count || 0)
			),
			scAmount: combinedData.map((item) =>
				Number(
					(
						(item.sc_total_bet_amount || 0) - (item.sc_casino_bet_rollback || 0)
					).toFixed(2)
				)
			),
			scCount: combinedData.map(
				(item) =>
					(item.sc_total_bet_count || 0) -
					(item.sc_casino_bet_rollback_count || 0)
			),
		};

		return {
			dates,
			purchaseStats,
			redeemStats,
			revenueStats,
			payoutStats,
			wageredStats,
		};
	}, [statisticsV2Data]);

	const formattedActiveUsers = useMemo(() => {
		if (!activeUsers?.length) {
			return {
				dates: [],
				activePlayerStats: {
					activeSCPlayers: [],
					activeGCPlayers: [],
					activeNewSCPlayers: [],
					activePlayers: [],
				},
			};
		}

		const sortedData = [...activeUsers].sort((a, b) =>
			moment(a.date).diff(moment(b.date))
		);

		return {
			dates: sortedData.map((item) => item.date),
			activePlayerStats: {
				activeSCPlayers: sortedData.map((item) =>
					Number(item.old_active_sc_player)
				),
				activeGCPlayers: sortedData.map((item) =>
					Number(item.old_active_gc_player)
				),
				activeNewSCPlayers: sortedData.map((item) =>
					Number(item.new_sc_player)
				),
				activePlayers: sortedData.map((item) => Number(item.active_player)),
			},
		};
	}, [activeUsers]);

	return {
		// statsData,
		// statsDataLoading,
		// loggedInOptions,
		setDashFilters,
		handleDashFilters,
		statisticsV2Loading,
		statisticsV2Data,
		formattedStats,
		activeUsersLoading,
		formattedActiveUsers,
		layoutModeType,
		showElementControl,
		setShowElementControl,
		formFields,
		validation,
		showRightSidebar,
	};
};

useDashboardView.propTypes = {};

useDashboardView.defaultProps = {
	cell: PropTypes.objectOf.isRequired,
};

export default useDashboardView;
