/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchTransactionBankingStart,
	resetTransactionBankingData,
} from '../../../store/actions';
import { getDateTimeInCT } from '../../../utils/dateFormatter';

import {
	CreatedAt,
	FromWallet,
	KeyValue,
	Purpose,
	Status,
	// Tags,
	ToWallet,
} from '../TransactionBankingCol';
import { STATUS_TYPE } from '../constants';
import { getTransactionBanking } from '../../../network/getRequests';
import { downloadReport } from '../../../helpers/common';
import ExportList from '../../../components/Common/ExportList';
import { COLOR_BY_CURRENCY, LEDGER_PURPOSE } from '../../../utils/constant';
import { convertToUTC, getDateRangeForOption } from '../../../utils/helpers';

const useTransactionBankingListing = (filterValues = {}, userId = '') => {
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [isDownloading, setIsDownloading] = useState({
		fullCsv: false,
	});
	const { transactionBanking, loading: isTransactionBankingLoading } =
		useSelector((state) => state.TransactionBanking);
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
			fetchTransactionBankingStart({
				...filterValues,
				perPage: itemsPerPage,
				page: currentPage,
				userId,
				fromDate: initialUTC.startUTC,
				toDate: initialUTC.endUTC,
			})
		);
	}, [currentPage, itemsPerPage]);

	// resetting transactions listing redux state
	useEffect(() => () => dispatch(resetTransactionBankingData()), []);

	const formattedTransactionBanking = useMemo(() => {
		const formattedValues = [];
		if (transactionBanking) {
			transactionBanking?.transactions?.forEach((transaction) => {
				// Handle purpose logic
				let purpose;
				if (!transaction?.transactionLedger?.length) {
					purpose = 'Purchase';
				} else if (transaction?.transactionLedger?.length > 1) {
					const firstPurpose = transaction?.transactionLedger?.[0]?.purpose;
					purpose = [
						'PurchaseGcCoin',
						'PurchaseScCoin',
						'PurchaseGcBonus',
						'PurchaseScBonus',
					].includes(firstPurpose)
						? 'Purchase'
						: LEDGER_PURPOSE?.find((p) => p?.value === firstPurpose)?.label;
				} else {
					const firstPurpose = transaction?.transactionLedger?.[0]?.purpose;
					purpose = LEDGER_PURPOSE?.find(
						(p) => p?.value === firstPurpose
					)?.label;
				}

				// Handle coins logic
				const renderCoins = () => {
					if (!transaction?.transactionLedger?.length) {
						const morDetails = [
							{ currencyId: 1, amount: transaction?.moreDetails?.gcCoin || 0 },
							{ currencyId: 2, amount: transaction?.moreDetails?.scBonus || 0 },
							{ currencyId: 3, amount: transaction?.moreDetails?.scCoin || 0 },
							{ currencyId: 1, amount: transaction?.moreDetails?.gcBonus || 0 },
						];

						return (
							<div className="d-flex">
								{morDetails.map(({ currencyId, amount }) => (
									<span
										className={`badge badge-soft-${COLOR_BY_CURRENCY?.[currencyId]} fs-6 mx-1`}
									>
										{currencyById?.[currencyId]?.code || ''}:{' '}
										{amount?.toFixed(2) ?? 0}
									</span>
								))}
							</div>
						);
					}

					return (
						<div className="d-flex">
							{transaction?.transactionLedger?.map(({ currencyId, amount }) => (
								<span
									className={`badge badge-soft-${COLOR_BY_CURRENCY?.[currencyId]} fs-6 mx-1`}
								>
									{currencyById?.[currencyId]?.code || ''}:{' '}
									{amount?.toFixed(2) ?? 0}
								</span>
							))}
						</div>
					);
				};

				// Construct transaction data
				const transactionData = {
					...transaction,
					purpose,
					coins: renderCoins(),
					from: transaction?.transactionLedger?.[0]?.fromWalletId
						? superAdminUser?.username
						: transaction?.user?.username,
					to: transaction?.transactionLedger?.[0]?.toWalletId
						? superAdminUser?.username
						: transaction?.user?.username,
					status: STATUS_TYPE.find(
						(status) => status.value === transaction?.status
					)?.label,
					createdAt: getDateTimeInCT(transaction?.createdAt),
				};

				formattedValues.push(transactionData);
			});
		}
		return formattedValues;
	}, [transactionBanking, superAdminUser, currencyById]);

	const columns = useMemo(
		() => [
			{
				Header: 'From',
				// accessor: 'from',
				accessor: 'to',
				filterable: true,
				Cell: ({ cell }) => <FromWallet value={cell.value} />,
			},
			{
				Header: 'To',
				// accessor: 'to',
				accessor: 'from',
				filterable: true,
				Cell: ({ cell }) => <ToWallet value={cell.value} />,
			},
			// {
			// 	Header: 'Coins',
			// 	accessor: 'coins',
			// 	filterable: true,
			// 	Cell: ({ cell }) => <KeyValue value={cell.value} />,
			// },
			{
				Header: 'Purpose',
				accessor: 'purpose',
				filterable: true,
				Cell: ({ cell }) => <Purpose value={cell.value} />,
			},
			// {
			// 	Header: 'Tags',
			// 	accessor: 'userTags',
			// 	filterable: true,
			// 	Cell: ({ cell }) => <Tags value={cell?.value} />,
			// },
			{
				Header: 'Status',
				accessor: 'status',
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Payment Id',
				accessor: 'paymentId',
				filterable: true,
				Cell: ({ cell }) => <KeyValue value={cell.value} />,
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
		const { data } = await getTransactionBanking({
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

		downloadReport('csv', data, 'Transactions Banking Report');
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
		totalTransactionBankingCount: transactionBanking?.transactions?.length || 0,
		transactionBanking,
		isTransactionBankingLoading,
		formattedTransactionBanking,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
	};
};

export default useTransactionBankingListing;
