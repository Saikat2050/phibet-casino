/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { KeyValueData, Username } from '../playerListCol';
import { getTopPlayers } from '../../../../store/dashboardView/actions';
import { modules } from '../../../../constants/permissions';
import usePermission from '../../../../components/Common/Hooks/usePermission';
import { convertToUTC, getDateRangeForOption } from '../../../../utils/helpers';
import usePlayerOptions from '../../../../utils/usePlayerOptions';

const usePlayerReport = () => {
	const dispatch = useDispatch();
	const playerOptions = usePlayerOptions();
	const { isGranted, permissions } = usePermission();
	const [timezone, setTimezone] = useState('GMT');
	const initialDateRange = getDateRangeForOption('last7days');
	const initialUTC = useMemo(
		() =>
			convertToUTC(
				initialDateRange.start.format('YYYY-MM-DD'),
				initialDateRange.end.format('YYYY-MM-DD'),
				timezone
			),
		[timezone, initialDateRange]
	);
	const [topPlayersDateOption, setTopPlayersDateOption] = useState({
		selected: 'last7days',
		fromDate: initialUTC.startUTC,
		toDate: initialUTC.endUTC,
	});
	const [currencyId, setCurrencyId] = useState('');
	const [orderBy, setOrderBy] = useState('netProfit');
	const [tagBy, setTagBy] = useState('');
	const { topPlayers, topPlayersLoading } = useSelector(
		(state) => state.DashboardViewInfo
	);

	const { currencies } = useSelector((state) => state.Currencies);

	const fetchTopPlayers = () => {
		if (isGranted(modules.reportPlayerPerformance, 'R')) {
			const { startUTC, endUTC } = convertToUTC(
				moment(topPlayersDateOption.fromDate).format('YYYY-MM-DD'),
				moment(topPlayersDateOption.toDate).format('YYYY-MM-DD'),
				timezone
			);

			dispatch(
				getTopPlayers({
					dateOptions: topPlayersDateOption.selected,
					fromDate: startUTC,
					toDate: endUTC,
					timezone,
					orderBy,
					tagIds: tagBy,
					currencyId,
					type: 'dashboard',
				})
			);
		}
	};

	const handleDateOptionChange = (e) => {
		const selectedOption = e.target.value;
		const dateRange = getDateRangeForOption(selectedOption);

		setTopPlayersDateOption({
			selected: selectedOption,
			fromDate: dateRange.start.toDate(),
			toDate: dateRange.end.toDate(),
		});
	};

	const handleRefresh = () => {
		setOrderBy(null);
		setTagBy(null);
		setCurrencyId(null);
		setTopPlayersDateOption({
			selected: 'last7days',
			fromDate: initialUTC.startUTC,
			toDate: initialUTC.endUTC,
		});

		fetchTopPlayers();
	};

	const topPlayerFormattedCSV = useMemo(
		() =>
			topPlayers?.reportData?.map((player) => ({
				Username: player.username ?? null,
				'Net Profit': player.netProfit ?? null,
				'SC Rewards': player.scRewards ?? null,
				'SC Wagered Amount': player.scStakedAmount ?? null,
				'SC Bet Count': player.scBetCount ?? null,
				'SC Casino Wins': player.scCasinoWins ?? null,
				'SC Casino Bet Rollback': player.scCasinoBetRollback ?? null,
				'SC Casino Win Rollback': player.scCasinoWinRollback ?? null,
				'SC Purchases': player.scPurchases ?? null,
				'GC Rewards': player.gcRewards ?? null,
				'GC Purchases': player.gcPurchases ?? null,
				'GC Wagered Amount': player.gcStakedAmount ?? null,
				'GC Bet Count': player.gcBetCount ?? null,
				'GC Casino Wins': player.gcCasinoWins ?? null,
				'GC Casino Bet Rollback': player.gcCasinoBetRollback ?? null,
				'GC Casino Win Rollback': player.gcCasinoWinRollback ?? null,
				'Redeem Completed Amount': player.redeemCompletedAmount ?? null,
				'Redeem Failed Amount': player.redeemFailedAmount ?? null,
				'Redeem Rejected Amount': player.redeemRejectedAmount ?? null,
			})) ?? [],
		[topPlayers]
	);

	const topPlayerFormatted = useMemo(
		() =>
			topPlayers?.reportData?.map((player) => ({
				...player,
			})) || [],
		[topPlayers]
	);

	useEffect(() => {
		fetchTopPlayers();
	}, [topPlayersDateOption, orderBy, currencyId, permissions, timezone, tagBy]);

	const columns = useMemo(
		() => [
			{
				Header: 'Username',
				accessor: 'username',
				notHidable: true,
				filterable: true,
				customColumnStyle: { fontWeight: 'bold' },
				Cell: ({ cell }) => <Username cell={cell} />,
			},
			{
				Header: 'Net Profit',
				accessor: 'netProfit',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'SC Rewards',
				accessor: 'scRewards',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'SC Wagered Amount',
				accessor: 'scStakedAmount',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'SC Bet Count',
				accessor: 'scBetCount',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'SC Casino Wins',
				accessor: 'scCasinoWins',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'SC Casino Bet Rollback',
				accessor: 'scCasinoBetRollback',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'SC Casino Win Rollback',
				accessor: 'scCasinoWinRollback',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'SC Purchases',
				accessor: 'scPurchases',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'GC Rewards',
				accessor: 'gcRewards',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'GC Purchases',
				accessor: 'gcPurchases',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'GC Wagered Amount',
				accessor: 'gcStakedAmount',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'GC Bet Count',
				accessor: 'gcBetCount',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'GC Casino Wins',
				accessor: 'gcCasinoWins',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'GC Casino Bet Rollback',
				accessor: 'gcCasinoBetRollback',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'GC Casino Win Rollback',
				accessor: 'gcCasinoWinRollback',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'Redeem Completed Amount',
				accessor: 'redeemCompletedAmount',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'Redeem Failed Amount',
				accessor: 'redeemFailedAmount',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
			{
				Header: 'Redeem Rejected Amount',
				accessor: 'redeemRejectedAmount',
				filterable: true,
				Cell: ({ cell }) => <KeyValueData value={cell?.value} />,
			},
		],
		[]
	);

	return {
		columns,
		topPlayerFormatted,
		topPlayersLoading,
		topPlayersDateOption,
		setTopPlayersDateOption,
		fetchTopPlayers,
		currencyId,
		setCurrencyId,
		orderBy,
		setOrderBy,
		tagBy,
		setTagBy,
		currencies,
		timezone,
		setTimezone,
		handleDateOptionChange,
		handleRefresh,
		topPlayerFormattedCSV,
		playerOptions,
	};
};

export default usePlayerReport;
