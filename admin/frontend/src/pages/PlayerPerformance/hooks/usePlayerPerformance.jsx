/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Email, KeyValueData } from '../PlayerPerformanceListCol';
import { fetchPlayerPerformanceStart } from '../../../store/playerPerformance/actions';
import { downloadReport } from '../../../helpers/common';
import { getTopPlayersRequest } from '../../../network/getRequests';
import { convertToUTC, getDateRangeForOption } from '../../../utils/helpers';
import ExportList from '../../../components/Common/ExportList';

const usePlayerPerformance = (filterValues = {}) => {
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
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

	const { playerPerformance, loading } = useSelector(
		(state) => state.PlayerPerformance
	);
	const [isDownloading, setIsDownloading] = useState({
		fullCsv: false,
	});

	useEffect(() => {
		dispatch(
			fetchPlayerPerformanceStart({
				type: 'all',
				perPage: itemsPerPage,
				page: currentPage,
				fromDate: initialUTC.startUTC,
				toDate: initialUTC.endUTC,
				...filterValues,
			})
		);
	}, [currentPage, itemsPerPage]);

	useEffect(() => {
		setCurrentPage(1);
	}, [filterValues]);

	const topPlayerFormatted = useMemo(
		() =>
			playerPerformance?.reportData?.map((player) => ({
				...player,
			})) || [],
		[playerPerformance]
	);

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Email',
				accessor: 'email',
				notHidable: true,
				filterable: true,
				customColumnStyle: { fontWeight: 'bold' },
				Cell: ({ cell }) => <Email cell={cell} />,
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

	const fetchReportData = async (report) => {
		setIsDownloading((prev) => ({
			...prev,
			[report.type]: true,
		}));
		const { data } = await getTopPlayersRequest({
			perPage: itemsPerPage,
			page: currentPage,
			...filterValues,
			csvDownload: true,
		});
		setIsDownloading((prev) => ({
			...prev,
			[report.type]: false,
		}));
		downloadReport('csv', data, 'Player Performance Report');
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
		totalCount: playerPerformance?.totalPages || 0,
		loading,
		playerPerformance: topPlayerFormatted,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
		timezone,
		setTimezone,
	};
};

export default usePlayerPerformance;
