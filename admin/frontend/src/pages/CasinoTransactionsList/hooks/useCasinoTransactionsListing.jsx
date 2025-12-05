/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchCasinoTransactionsStart,
	resetCasinoTransactionsData,
} from '../../../store/actions';
import { getDateTimeInCT } from '../../../utils/dateFormatter';
import {
	ActionType,
	CreatedAt,
	FromWallet,
	GameName,
	Id,
	KeyValue,
	Purpose,
	Status,
	ToWallet,
} from '../CasinoTransactionsListCol';
import { STATUS_TYPE } from '../constants';
import { downloadReport } from '../../../helpers/common';
import { getCasinoTransactions } from '../../../network/getRequests';
import ExportList from '../../../components/Common/ExportList';
import { selectedLanguage } from '../../../constants/config';
import { COLOR_BY_CURRENCY, LEDGER_PURPOSE } from '../../../utils/constant';
import { convertToUTC, getDateRangeForOption } from '../../../utils/helpers';

const useCasinoTransactionsListing = (filterValues = {}, userId = '') => {
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [isDownloading, setIsDownloading] = useState({
		fullCsv: false,
	});
	const { casinoTransactions, loading: isCasinoTransactionsLoading } =
		useSelector((state) => state.CasinoTransactions);
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

	useEffect(() => {
		dispatch(
			fetchCasinoTransactionsStart({
				...filterValues,
				perPage: itemsPerPage,
				page: currentPage,
				userId,
				fromDate: initialUTC.startUTC,
				toDate: initialUTC.endUTC,
			})
		);
	}, [currentPage, itemsPerPage]);

	// resetting casino transactions listing redux state
	useEffect(() => () => dispatch(resetCasinoTransactionsData()), []);

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};
	const formattedCasinoTransactions = useMemo(() => {
		const formattedValues = [];
		if (casinoTransactions) {
			casinoTransactions?.casinoTransactions?.map((txn) =>
				formattedValues.push({
					...txn,
					id: txn?.id,
					walletId: txn?.walletId,
					transactionId: txn?.transactionId,
					gameId: txn?.casinoGame?.uniqueId || '-',
					gameName: txn?.casinoGame?.name?.[selectedLanguage] || '-',
					conversionRate: txn?.conversionRate,
					actionType: txn?.casinoLedger?.[0]?.fromWalletId ? 'Debit' : 'Credit',
					coins: (
						<div className="d-flex">
							{txn?.casinoLedger?.map(({ currencyId, amount }) => (
								<span
									className={`badge badge-soft-${COLOR_BY_CURRENCY?.[currencyId]} fs-6 mx-1`}
								>
									{currencyById?.[currencyId]?.code || ''}:{' '}
									{amount?.toFixed(2) ?? 0}
								</span>
							))}
						</div>
					),
					purpose: LEDGER_PURPOSE?.find(
						(purpose) => purpose?.value === txn?.casinoLedger?.[0]?.purpose
					)?.label,
					from: txn?.casinoLedger?.[0]?.fromWalletId
						? txn?.user?.email
						: superAdminUser?.username,
					to: txn?.casinoLedger?.[0]?.toWalletId
						? txn?.user?.email
						: superAdminUser?.username,
					status: STATUS_TYPE.find((status) => status.value === txn?.status)
						?.label,
					createdAt: getDateTimeInCT(txn?.createdAt),
				})
			);
		}
		return formattedValues;
	}, [casinoTransactions, superAdminUser, currencyById]);

	const columns = useMemo(
		() => [
			{
				Header: 'Game ID',
				accessor: 'gameId',
				filterable: true,
				Cell: ({ cell }) => <GameName value={cell.value} />,
			},
			{
				Header: 'Game Name',
				accessor: 'gameName',
				filterable: true,
				Cell: ({ cell }) => <GameName value={cell.value} />,
			},
			{
				Header: 'From',
				accessor: 'from',
				filterable: true,
				Cell: ({ cell }) => <FromWallet value={cell.value} />,
			},
			{
				Header: 'To',
				accessor: 'to',
				filterable: true,
				Cell: ({ cell }) => <ToWallet value={cell.value} />,
			},
			{
				Header: 'Coins',
				accessor: 'coins',
				filterable: true,
				Cell: ({ cell }) => <KeyValue value={cell.value} />,
			},
			{
				Header: 'Action Type',
				accessor: 'actionType',
				filterable: true,
				Cell: ({ cell }) => (
					<ActionType
						value={cell.value}
						type={cell?.row?.original?.casinoLedger?.[0]?.toWalletId}
					/>
				),
			},

			{
				Header: 'Purpose',
				accessor: 'purpose',
				filterable: true,
				Cell: ({ cell }) => <Purpose value={cell.value} />,
			},
			{
				Header: 'Transaction Id',
				accessor: 'transactionId',
				filterable: true,
				Cell: ({ cell }) => <Id value={cell.value} />,
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Date',
				accessor: 'createdAt',
				Cell: ({ cell }) => <CreatedAt value={cell.value} />,
			},
		],
		[filterValues.currencyId]
	);

	const fetchReportData = async (report) => {
		setIsDownloading((prev) => ({
			...prev,
			[report.type]: true,
		}));
		const { data } = await getCasinoTransactions({
			perPage: itemsPerPage,
			page: currentPage,
			userId,
			...filterValues,
			csvDownload: true,
		});
		setIsDownloading((prev) => ({
			...prev,
			[report.type]: false,
		}));

		downloadReport('csv', data, 'Casino Transactions Report');
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
		casinoTransactions,
		isCasinoTransactionsLoading,
		formattedCasinoTransactions,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
	};
};

export default useCasinoTransactionsListing;
