/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getLedgerDetailsStart,
	resetTransactionBankingData,
} from '../../../store/actions';
import { getDateTimeInCT } from '../../../utils/dateFormatter';
import { CapitalizedValue, CellValue } from '../LedgerCol';
import { COLOR_BY_CURRENCY, LEDGER_PURPOSE } from '../../../utils/constant';
import { downloadReport } from '../../../helpers/common';
import ExportList from '../../../components/Common/ExportList';
import { getLedgerDetails } from '../../../network/getRequests';
import { convertToUTC, getDateRangeForOption } from '../../../utils/helpers';

const useLedgerListing = (userId, filterValues = {}) => {
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const { ledgerDetail, ledgerDetailLoading } = useSelector(
		(state) => state.TransactionBanking
	);
	const [isDownloading, setIsDownloading] = useState({
		fullCsv: false,
	});
	const superAdminUser = useSelector(
		(state) => state.PermissionDetails.superAdminUser
	);
	const { currencyById } = useSelector((state) => state.Currencies);
	const initialDateRange = getDateRangeForOption('last3days');
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

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	useEffect(() => {
		dispatch(
			getLedgerDetailsStart({
				...filterValues,
				perPage: itemsPerPage,
				page: currentPage,
				userId,
				fromDate: initialUTC.startUTC,
				toDate: initialUTC.endUTC,
			})
		);
	}, [currentPage, itemsPerPage, userId]);

	const formattedLedgerDetails = useMemo(
		() =>
			ledgerDetail?.ledgers?.map((ledger) => ({
				...ledger,
				to: ledger?.fromWallet
					? ledger?.fromWallet?.user?.username
					: superAdminUser?.username,
				from: ledger?.toWallet
					? ledger?.toWallet?.user?.username
					: superAdminUser?.username,
				coins: (
					<div className="d-flex">
						<span
							className={`badge badge-soft-${
								COLOR_BY_CURRENCY?.[ledger.currencyId]
							} fs-6 mx-1`}
						>
							{currencyById?.[ledger?.currencyId]?.code || ''}:{' '}
							{ledger?.amount?.toFixed(2) ?? 0}
						</span>
					</div>
				),
				purpose: LEDGER_PURPOSE?.find(
					(purpose) => purpose?.value === ledger?.purpose
				)?.label,
				createdAt: getDateTimeInCT(ledger?.createdAt),
			})) || [],
		[ledgerDetail, superAdminUser, currencyById]
	);

	// resetting transactions listing redux state
	useEffect(() => () => dispatch(resetTransactionBankingData()), []);

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'Id',
			// 	accessor: 'id',
			// 	notHidable: true,
			// 	filterable: true,
			// 	Cell: ({ cell }) => <CellValue value={cell.value} />,
			// },
			{
				Header: 'Transaction Id',
				accessor: 'transactionId',
				filterable: true,
				Cell: ({ cell }) => <CellValue value={cell.value} />,
			},
			{
				Header: 'From',
				// accessor: 'from',
				accessor: 'to',
				filterable: true,
				Cell: ({ cell }) => <CellValue value={cell.value} />,
			},
			{
				Header: 'To',
				// accessor: 'to',\
				accessor: 'from',
				filterable: true,
				Cell: ({ cell }) => <CellValue value={cell.value} />,
			},
			{
				Header: 'Purpose',
				accessor: 'purpose',
				filterable: true,
				Cell: ({ cell }) => <CapitalizedValue value={cell.value} />,
			},
			{
				Header: 'Transaction Type',
				accessor: 'transactionType',
				Cell: ({ cell }) => <CapitalizedValue value={cell.value} />,
			},
			{
				Header: 'Date',
				accessor: 'createdAt',
				Cell: ({ cell }) => <CellValue value={cell.value} />,
			},
		],
		[]
	);

	const fetchReportData = async (report) => {
		setIsDownloading((prev) => ({
			...prev,
			[report.type]: true,
		}));
		const { data } = await getLedgerDetails({
			...filterValues,
			perPage: itemsPerPage,
			page: currentPage,
			userId,
			csvDownload: true,
		});
		setIsDownloading((prev) => ({
			...prev,
			[report.type]: false,
		}));
		downloadReport('csv', data, 'Ledger report');
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
		totalLedgerCount: ledgerDetail?.totalPages || 0,
		ledgerDetail,
		ledgerDetailLoading,
		formattedLedgerDetails,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
	};
};

export default useLedgerListing;
