/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import moment from 'moment';
import { UncontrolledTooltip } from 'reactstrap';
import {
	resetCasinoTransactionsData,
	getGamePlayerCountStart,
} from '../../../store/actions';
// import { STATUS_TYPE } from '../constants';
import {
	GameRevenue,
	IdValue,
	Name,
	// NumberPlayer,
	Payout,
	TotalBetsAmount,
	TotalWins,
	// UserEmail,
} from '../GameTransactionsListCol';
import { fetchGameTransactionsStart } from '../../../store/gameTransactions/actions';
import { downloadReport } from '../../../helpers/common';
import { convertToUTC, getDateRangeForOption } from '../../../utils/helpers';
// import { getGameReports } from '../../../network/getRequests';
import ExportList from '../../../components/Common/ExportList';
import { getGameReports } from '../../../network/getRequests';

const useGameTransactionsListing = (filterValues = {}) => {
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [isDownloading, setIsDownloading] = useState({
		fullCsv: false,
	});
	const { gameTransactions, loading } = useSelector(
		(state) => state.GameTransactions
	);

	const initialDateRange = getDateRangeForOption('last3days');
	// const [timezone, setTimezone] = useState('GMT');
	const timezone = 'GMT';
	const initialUTC = useMemo(
		() =>
			convertToUTC(
				initialDateRange.start.format('YYYY-MM-DD'),
				initialDateRange.end.format('YYYY-MM-DD'),
				timezone
			),
		[timezone, initialDateRange]
	);

	// const [formattedDates, setFormattedDates] = useState({
	// 	fromDate: initialUTC?.startUTC,
	// 	toDate: initialUTC?.endUTC,
	// });

	// useEffect(() => {
	// 	if (filterValues.fromDate || filterValues.toDate) {
	// 		const dates = { ...filterValues };
	// 		if (dates.fromDate) {
	// 			dates.fromDate = moment(dates.fromDate).format(
	// 				'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
	// 			);
	// 		}
	// 		if (dates.toDate) {
	// 			dates.toDate = moment(dates.toDate).format(
	// 				'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
	// 			);
	// 		}
	// 		setFormattedDates(dates);
	// 	}
	// }, [filterValues.fromDate, filterValues.toDate]);

	const handlePlayerCount = React.useCallback(
		(row) => {
			const rowId = row.original.id;
			dispatch(
				getGamePlayerCountStart({
					id: rowId,
					...filterValues,
					fromDate: initialUTC.startUTC,
					toDate: initialUTC.endUTC,
					// ...formattedDates,
				})
			);
		},
		// [formattedDates, filterValues, dispatch]
		[filterValues, dispatch]
	);

	useEffect(() => {
		dispatch(
			fetchGameTransactionsStart({
				perPage: itemsPerPage,
				page: currentPage,
				type: 'report',
				fromDate: initialUTC.startUTC,
				toDate: initialUTC.endUTC,
				...filterValues,
				// ...formattedDates,
			})
		);
	}, [currentPage, itemsPerPage]);

	// resetting casino transactions listing redux state
	useEffect(() => () => dispatch(resetCasinoTransactionsData()), []);

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				notHidable: true,
				filterable: true,
				Cell: ({ cell }) => <IdValue cell={cell?.value || '-'} />,
			},
			{
				Header: 'NAME',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => <Name cell={cell?.value || '-'} />,
			},
			{
				Header: 'TOTAL REVENUE',
				accessor: 'gameRevenue',
				disableFilters: true,
				Cell: ({ cell }) => <GameRevenue cell={cell?.value ?? 0} />,
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
		],
		[filterValues, handlePlayerCount]
	);

	const fetchReportData = async (report) => {
		setIsDownloading((prev) => ({
			...prev,
			[report.type]: true,
		}));
		const { data } = await getGameReports({
			perPage: itemsPerPage,
			page: currentPage,
			...filterValues,
			csvDownload: true,
		});
		setIsDownloading((prev) => ({
			...prev,
			[report.type]: false,
		}));
		downloadReport('csv', data, 'Game Reports');
	};

	const exportList = useMemo(() => [
		{
			label: 'Download',
			isDownload: true,
			isCsv: true,
			tooltip: 'Download CSV Report',
			icon: <i className="mdi mdi-download-multiple" />,
			buttonColor: 'primary',
			type: 'fullCsv',
			handleDownload: fetchReportData,
			isDownloading: isDownloading.fullCsv,
		},
	]);

	const actionList = <ExportList exportList={exportList} />;

	return {
		currentPage,
		setCurrentPage,
		totalCount: gameTransactions?.totalPages || 0,
		loading,
		gameTransactions,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
	};
};

export default useGameTransactionsListing;
