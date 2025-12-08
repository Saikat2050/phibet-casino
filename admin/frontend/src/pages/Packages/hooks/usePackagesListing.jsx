/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deletePackage, getAllPackages } from '../../../store/packages/actions';
import { Amount, BooleanCol, CellValue, Status } from '../packagesListCol';
import Actions from '../../../components/Common/Actions';
import ButtonList from '../../../components/Common/ButtonList';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import { useConfirmModal } from '../../../components/Common/ConfirmModal';

const usePackagesListing = (filterValues = {}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { openConfirmModal } = useConfirmModal();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const { isGranted } = usePermission();
	const { packages, isPackagesLoading } = useSelector(
		(state) => state.Packages
	);

	const fetchData = () => {
		dispatch(
			getAllPackages({
				perPage: itemsPerPage,
				page,
				...filterValues,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [page, itemsPerPage]);

	const handleAddClick = (e) => {
		e.preventDefault();
		navigate('create');
	};

	const handleReorder = (e) => {
		e.preventDefault();
		navigate('/packages/reorder');
	};

	const buttonList = [
		{
			label: (
				<>
					{' '}
					<i className="mdi mdi-plus" /> Create
				</>
			),
			handleClick: handleAddClick,
			link: '#!',
			module: modules.package,
			operation: 'C',
		},
		{
			label: 'Reorder',
			handleClick: handleReorder,
			link: '#!',
			module: modules.package,
			operation: 'C',
		},
	];

	const deleteHandler = (id) => dispatch(deletePackage({ id, fetchData }));

	const actionList = <ButtonList buttonList={buttonList} />;

	const handleEditClick = (row) => navigate(`edit/${row?.id}`);

	const confirmDelete = (row) => {
		openConfirmModal('Are you sure you want to delete this Package?', () =>
			deleteHandler(row?.id)
		);
	};

	const actionsList = [
		// {
		// 	actionName: 'View',
		// 	actionHandler: handleViewClick,
		// 	isHidden: !isGranted(modules.package, 'R'),
		// 	icon: ICON_CLASS.view,
		// 	iconColor: TEXT_COLORS.info,
		// },
		{
			actionName: 'Edit',
			actionHandler: handleEditClick,
			isHidden: !isGranted(modules.package, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Delete',
			actionHandler: confirmDelete,
			isHidden: !isGranted(modules.package, 'D'),
			icon: ICON_CLASS.delete,
			iconColor: TEXT_COLORS.danger,
		},
	];

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'Order Id',
			// 	accessor: 'orderId',
			// 	filterable: true,
			// 	Cell: ({ cell }) => <CellValue value={cell.value} />,
			// },
			{
				Header: 'Label Name',
				accessor: 'lable',
				filterable: true,
				Cell: ({ cell }) => <CellValue value={cell.value} />,
			},
			{
				Header: 'Amount',
				accessor: 'amount',
				filterable: true,
				Cell: ({ cell }) => <CellValue value={cell.value} />,
			},
			{
				Header: 'USD',
				accessor: 'gcCoin',
				filterable: true,
				Cell: ({ cell }) => <Amount value={cell.value} />,
			},
			// {
			// 	Header: 'USD',
			// 	accessor: 'scCoin',
			// 	disableFilters: true,
			// 	disableSortBy: true,
			// 	Cell: ({ cell }) => <CellValue value={cell.value} />,
			// },
			{
				Header: 'Visible in Store',
				accessor: 'isVisibleInStore',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => <BooleanCol value={cell.value} />,
			},
			{
				Header: 'Discount Amount',
				accessor: 'discountAmount',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => <CellValue value={cell.value} />,
			},
			{
				Header: 'Maximum Purchase Per User',
				accessor: 'maxPurchasePerUser',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => <CellValue value={cell.value} />,
			},
			// {
			// 	Header: 'Giftable',
			// 	accessor: 'giftable',
			// 	disableFilters: true,
			// 	disableSortBy: true,
			// 	Cell: ({ cell }) => <BooleanCol value={cell.value} />,
			// },
			// {
			// 	Header: 'Image',
			// 	accessor: 'imageUrl',
			// 	disableFilters: true,
			// 	disableSortBy: true,
			// 	Cell: ({ cell }) => <ImagePreview value={cell.value} />,
			// },
			{
				Header: 'Status',
				accessor: 'isActive',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Action',
				accessor: 'action',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => {
					const onlyReadPermission =
						!isGranted(modules.package, 'U') &&
						!isGranted(modules.package, 'D');

					return (
						<Actions
							cell={cell}
							actionsList={actionsList}
							disabled={onlyReadPermission}
						/>
					);
				},
			},
		],
		[packages, isGranted(modules.package, 'U'), isGranted(modules.package, 'D')]
	);

	const onChangeRowsPerPage = (value) => {
		setPage(1);
		setItemsPerPage(value);
	};

	return {
		itemsPerPage,
		setItemsPerPage,
		page,
		setPage,
		columns,
		packages,
		totalPages: packages?.totalPages,
		isPackagesLoading,
		onChangeRowsPerPage,
		actionList,
	};
};

export default usePackagesListing;
