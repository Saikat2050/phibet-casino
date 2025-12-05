/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import {
	GameRevenue,
	// IdValue,
	Name,
	// NumberPlayer,
	Payout,
	TotalBetsAmount,
	TotalWins,
} from '../gameListCol';
import { CURRENCY_OPTIONS, TABS } from '../../constant';
import {
	getGamePlayerCountStart,
	getGameReportStart,
} from '../../../../store/dashboardView/actions';
import usePermission from '../../../../components/Common/Hooks/usePermission';
import { modules } from '../../../../constants/permissions';
import { convertToUTC, getDateRangeForOption } from '../../../../utils/helpers';
import usePlayerOptions from '../../../../utils/usePlayerOptions';

const useGameReport = () => {
	const dispatch = useDispatch();
	const playerOptions = usePlayerOptions();
	const { isGranted, permissions } = usePermission();
	const initialDateRange = getDateRangeForOption('last7days');
	const [timezone, setTimezone] = useState('GMT');
	const initialUTC = useMemo(
		() =>
			convertToUTC(
				initialDateRange.start.format('YYYY-MM-DD'),
				initialDateRange.end.format('YYYY-MM-DD'),
				timezone
			),
		[timezone, initialDateRange]
	);
	const [gameReportDateOption, setGameReportDateOption] = useState({
		selected: 'last7days',
		fromDate: initialUTC.startUTC,
		toDate: initialUTC.endUTC,
	});
	const [activeGameReportTab, setActiveGameReportTab] = useState(TABS.GAME);
	const [currencyId, setCurrencyId] = useState(CURRENCY_OPTIONS[0].id);
	const [orderBy, setOrderBy] = useState(null);
	const [tagBy, setTagBy] = useState(null);
	const [topGamesCount, setTopGamesCount] = useState(5);

	const { gameReport, isGameReportLoading } = useSelector(
		(state) => state.DashboardViewInfo
	);

	const { gamePlayerCount: playerCount } = useSelector(
		(state) => state.DashboardViewInfo
	);

	const { currencies } = useSelector((state) => state.Currencies);

	const loadGameReport = () => {
		if (isGranted(modules.gameReport, 'R')) {
			const dateRange = getDateRangeForOption(gameReportDateOption.selected, {
				fromDate: gameReportDateOption.fromDate,
				toDate: gameReportDateOption.toDate,
			});

			const { startUTC, endUTC } = convertToUTC(
				dateRange.start.format('YYYY-MM-DD'),
				dateRange.end.format('YYYY-MM-DD'),
				timezone
			);

			dispatch(
				getGameReportStart({
					tab: activeGameReportTab,
					dateOptions: gameReportDateOption.selected,
					fromDate: startUTC,
					toDate: endUTC,
					timezone,
					orderBy,
					tagIds: tagBy,
					currencyId: currencyId === '0' ? null : currencyId,
					perPage: topGamesCount,
				})
			);
		}
	};

	const handleDateOptionChange = (e) => {
		const selectedOption = e.target.value;
		const dateRange = getDateRangeForOption(selectedOption);

		const { startUTC, endUTC } = convertToUTC(
			dateRange.start.format('YYYY-MM-DD'),
			dateRange.end.format('YYYY-MM-DD'),
			timezone
		);

		setGameReportDateOption({
			selected: selectedOption,
			fromDate: startUTC,
			toDate: endUTC,
		});
	};

	const handleRefresh = () => {
		setTopGamesCount(5);
		setOrderBy(null);
		setTagBy(null);
		setCurrencyId(CURRENCY_OPTIONS[0].id);
		setGameReportDateOption({
			selected: 'last7days',
			fromDate: initialUTC.startUTC,
			toDate: initialUTC.endUTC,
		});

		dispatch(
			getGameReportStart({
				tab: activeGameReportTab,
				dateOptions: gameReportDateOption.selected,
				fromDate: gameReportDateOption.fromDate,
				toDate: gameReportDateOption.toDate,
				orderBy: null,
				tagBy: null,
				currencyId: null,
				limit: 5,
			})
		);
	};

	const handlePlayerCount = React.useCallback(
		(row) => {
			const rowId = row.original.id;

			dispatch(
				getGamePlayerCountStart({
					dateOptions: gameReportDateOption.selected,
					fromDate: gameReportDateOption.fromDate,
					toDate: gameReportDateOption.toDate,
					id: rowId,
					currencyId: currencyId === '0' ? null : currencyId,
					tab: activeGameReportTab,
					tagIds: tagBy,
				})
			);
		},
		[gameReportDateOption, currencyId, activeGameReportTab, tagBy]
	);

	useEffect(() => {
		if (activeGameReportTab) {
			const { fromDate, toDate, selected } = gameReportDateOption;
			if (selected === 'custom') {
				if (fromDate && toDate) {
					loadGameReport();
				}
			} else {
				loadGameReport();
			}
		}
	}, [
		activeGameReportTab,
		gameReportDateOption,
		orderBy,
		tagBy,
		currencyId,
		permissions,
		topGamesCount,
		timezone,
	]);

	const gameReportColumn = useMemo(
		() => [
			{
				Header: 'NAME',
				accessor: 'name',
				customColumnStyle: { fontWeight: 'bold' },
				filterable: true,
				Cell: ({ cell }) => <Name cell={cell?.value || '-'} />,
			},
			{
				Header: 'TOTAL REVENUE',
				accessor: 'gameRevenue',
				disableFilters: true,
				Cell: ({ cell }) => <GameRevenue cell={cell?.value ?? 0} />,
			},
			{
				Header: 'TOTAL WAGERED',
				accessor: 'totalBetAmount',
				filterable: true,
				Cell: ({ cell }) => <TotalBetsAmount cell={cell?.value ?? 0} />,
			},
			{
				Header: 'TOTAL PAYOUT',
				accessor: 'totalWinAmount',
				disableFilters: true,
				Cell: ({ cell }) => <TotalWins cell={cell?.value ?? 0} />,
			},

			{
				Header: 'RTP',
				accessor: 'payout',
				disableFilters: true,
				Cell: ({ cell }) => <Payout cell={cell?.value ?? 0} />,
			},
			// {
			// 	Header: 'PLAYED BY',
			// 	accessor: 'totalPlayers',
			// 	filterable: true,
			// 	Cell: ({ cell }) => <NumberPlayer cell={cell?.value ?? '0'} />,
			// },

			{
				Header: 'PLAYED BY',
				accessor: 'totalPlayers',
				filterable: true,
				disableSortBy: true,
				Cell: ({ row }) => {
					const { gamePlayerCount } = useSelector(
						(state) => state.DashboardViewInfo
					);

					const rowId = row.original.id;
					const playerCountForRow = gamePlayerCount?.[rowId]?.count;
					const isRowLoading = gamePlayerCount?.[rowId]?.isLoading;

					return (
						<div className="d-flex align-items-center gap-2">
							{!isRowLoading && playerCountForRow === undefined && (
								<>
									<i
										role="button"
										tabIndex={0}
										aria-label="View Player Count"
										className="mdi mdi-eye text-primary cursor-pointer"
										onClick={() => handlePlayerCount(row)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												handlePlayerCount(row);
											}
										}}
										id={`view-count-${rowId}`}
										style={{ fontSize: '18px' }}
									/>
									<UncontrolledTooltip
										placement="top"
										target={`view-count-${rowId}`}
									>
										View Player Count
									</UncontrolledTooltip>
								</>
							)}

							{isRowLoading && (
								<div
									className="spinner-border spinner-border-sm text-secondary"
									role="status"
								/>
							)}

							{!isRowLoading && playerCountForRow !== undefined && (
								<span>{playerCountForRow}</span>
							)}
						</div>
					);
				},
			},
		],
		[handlePlayerCount]
	);

	const gameReportFormatted = useMemo(
		() =>
			gameReport?.map((game) => {
				const rowPlayerCount = playerCount?.[game.id]?.count ?? 'N/A';

				return {
					Name: game.name,
					'Total Revenue': game.gameRevenue ?? null,
					'Total Wagered': game.totalBetAmount ?? null,
					'Total Payout': game.totalWinAmount ?? null,
					'RTP (%)':
						game.totalBetAmount > 0
							? (
									(parseFloat(game.totalWinAmount) /
										parseFloat(game.totalBetAmount)) *
									100
							  ).toFixed(2)
							: '0.00',
					'Played By': rowPlayerCount,
				};
			}) || [],
		[gameReport, playerCount]
	);

	return {
		gameReport,
		gameReportColumn,
		activeGameReportTab,
		setActiveGameReportTab,
		gameReportDateOption,
		setGameReportDateOption,
		loadGameReport,
		isGameReportLoading,
		setCurrencyId,
		currencyId,
		orderBy,
		setOrderBy,
		tagBy,
		setTagBy,
		currencies,
		topGamesCount,
		setTopGamesCount,
		handleRefresh,
		timezone,
		setTimezone,
		handleDateOptionChange,
		gameReportFormatted,
		playerOptions,
	};
};

export default useGameReport;
