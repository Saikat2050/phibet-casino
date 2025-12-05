/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	approveRejectWithdrawRequestsStart,
	fetchWithdrawRequestsStart,
} from '../../../store/actions';
import {
	Date,
	Custom,
	WithdrawalId,
	UserId,
} from '../WithdrawalRequestListCol';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import Actions from '../../../components/Common/Actions';

const useWithdrawalRequestListing = (filterValues = {}) => {
	const { withdrawRequests, loading, approveRejectWithdrawRequest } =
		useSelector((state) => state.WithdrawRequests);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const dispatch = useDispatch();

	const onChangeRowsPerPage = (value) => {
		setPage(1);
		setItemsPerPage(value);
	};

	const fetchData = () => {
		dispatch(
			fetchWithdrawRequestsStart({
				perPage: itemsPerPage,
				page,
				...filterValues,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [page, itemsPerPage, approveRejectWithdrawRequest]);

	const formatStatus = (status) => {
		if (!status) return '';
		return status.replace(/_/g, ' ').toUpperCase();
	};

	// const handleApprove = (props) => {
	// 	const { id } = props;
	// 	dispatch(
	// 		approveRejectWithdrawRequestsStart({
	// 			withdrawalId: id,
	// 			status: 'approved',
	// 		})
	// 	);
	// };

	// const handleReject = (props) => {
	// 	const { id } = props;
	// 	dispatch(
	// 		approveRejectWithdrawRequestsStart({
	// 			withdrawalId: id,
	// 			status: 'rejected',
	// 		})
	// 	);
	// };

	const handleStatusRedeem = (userId, id, status) => {
		dispatch(
			approveRejectWithdrawRequestsStart({
				userId,
				withdrawalId: id,
				status,
			})
		);
	};

	const actionsList = ({ userId, status }) => [
		{
			actionName: 'Approved',
			actionHandler: ({ id }) => handleStatusRedeem(userId, id, 'approved'),
			isHidden: false,
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.success,
			isDisabled: () => status !== 'pending' && status !== 'approved',
		},
		{
			actionName: 'Rejected',
			actionHandler: ({ id }) => handleStatusRedeem(userId, id, 'rejected'),
			isHidden: false,
			icon: ICON_CLASS.reject,
			iconColor: TEXT_COLORS.danger,
			isDisabled: () => status !== 'pending' && status !== 'approved',
		},
	];

	const columns = useMemo(
		() => [
			{
				// Header: 'Id',
				accessor: 'id',
				filterable: true,
				Cell: ({ cell }) => <WithdrawalId value={cell.value} />,
			},
			{
				Header: 'Player Id',
				accessor: 'userId',
				filterable: true,
				customColumnStyle: { fontWeight: 'bold' },
				Cell: ({ cell }) => <UserId cell={cell} />,
			},
			{
				Header: 'Transaction Id',
				accessor: 'transactionId',
				filterable: true,
				Cell: ({ cell }) => <Custom value={cell.value} />,
			},
			{
				Header: 'SC Coins',
				accessor: 'amount',
				filterable: true,
				Cell: ({ cell }) => <Custom value={cell.value} />,
			},
			{
				Header: 'Created At',
				accessor: 'createdAt',
				filterable: true,
				Cell: ({ cell }) => <Date value={cell.value} />,
			},
			{
				Header: 'Approved At',
				accessor: 'approvedAt',
				filterable: true,
				Cell: ({ cell }) => <Date value={cell.value} />,
			},
			{
				Header: 'Status',
				accessor: 'status',
				filterable: true,
				Cell: ({ cell }) => <Custom value={formatStatus(cell.value)} />,
			},
			{
				Header: 'Confirmed At',
				accessor: 'confirmedAt',
				filterable: true,
				Cell: ({ cell }) => <Date value={cell.value} />,
			},
			{
				Header: 'Actions',
				accessor: 'actions',
				disableSortBy: true,
				disableFilters: true,
				// Cell: ({ cell }) => (
				// 	<Actions cell={cell} actionsList={actionsList(cell?.row?.original)} />
				// ),
				Cell: ({ cell }) => (
					<div
						style={{
							pointerEvents:
								cell.row.original.status === 'pending' ? 'auto' : 'none',
							opacity: cell.row.original.status === 'pending' ? 1 : 0.5,
							cursor:
								cell.row.original.status === 'pending'
									? 'pointer'
									: 'not-allowed',
						}}
					>
						<Actions
							cell={cell}
							actionsList={actionsList(cell?.row?.original)}
						/>
					</div>
				),
			},
		],
		[]
	);

	return {
		withdrawRequestsData: withdrawRequests?.transactions || [],
		isLoading: loading,
		itemsPerPage,
		page,
		setPage,
		onChangeRowsPerPage,
		columns,
		totalPageCount: withdrawRequests?.totalPages || 0,
	};
};

export default useWithdrawalRequestListing;
