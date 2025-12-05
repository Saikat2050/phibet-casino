/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPaymentListing } from '../../../store/actions';
import { modules } from '../../../constants/permissions';
import ButtonList from '../../../components/Common/ButtonList';
// import Actions from '../FormSections/Actions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import usePermission from '../../../components/Common/Hooks/usePermission';
import Actions from '../../../components/Common/Actions';
// import { updateAppSettingRequest } from '../../../network/postRequests';

const usePaymentListing = (filterValues = {}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { paymentListing, isLoading } = useSelector((state) => state.Payment);
	const [page, setPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const onChangeRowsPerPage = (value) => {
		setPage(1);
		setItemsPerPage(value);
	};

	const { isGranted } = usePermission();

	const fetchData = () => {
		dispatch(
			getPaymentListing({
				perPage: itemsPerPage,
				page,
				...filterValues,
			})
		);
	};

	const fetchMoreData = () => {
		setPage((prev) => prev + 1);
		dispatch(
			getPaymentListing(
				{
					perPage: 10,
					page: page + 1,
					...filterValues,
				},
				'MoreData'
			)
		);
	};

	useEffect(() => {
		if (location.pathname === '/payment') fetchData();
	}, [location, page, itemsPerPage]);

	const buttonList = useMemo(() => [
		{
			label: 'Add',
			link: '/payment/add',
			handleClick: () => {
				navigate('/payment/add');
			},
			module: modules.paymentManagement,
			operation: 'U',
		},
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	const tableActions = (row) => [
		{
			actionName: 'View',
			actionHandler: () => {
				navigate(`details/${row?.id}`);
			},
			isHidden: !isGranted(modules.paymentManagement, 'R'),
			icon: ICON_CLASS.view,
			iconColor: TEXT_COLORS.info,
		},
		{
			actionName: 'Edit',
			actionHandler: () => {
				navigate(`edit/${row?.id}`);
			},
			isHidden: !isGranted(modules.paymentManagement, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
	];

	const columns = useMemo(
		() => [
			{
				Header: 'Id',
				accessor: 'id',
				filterable: true,
				Cell: ({ cell }) => cell.value,
			},
			{
				Header: 'Provider Name',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => cell.value?.EN,
			},
			{
				Header: 'Aggregator',
				accessor: 'aggregator',
				filterable: true,
				Cell: ({ cell }) => cell.value,
			},
			{
				Header: 'Category',
				accessor: 'category',
				filterable: true,
				Cell: ({ cell }) => cell.value,
			},
			{
				Header: 'Actions',
				accessor: 'actions',
				disableSortBy: true,
				Cell: ({ cell }) => (
					<Actions
						cell={cell}
						actionsList={tableActions(cell?.row?.original)}
					/>
				),
			},
		],
		[]
	);

	return {
		isLoading,
		page,
		paymentListing,
		actionList,
		navigate,
		fetchMoreData,
		columns,
		itemsPerPage,
		onChangeRowsPerPage,
		setPage,
	};
};

usePaymentListing.propTypes = {};

usePaymentListing.defaultProps = {
	cell: PropTypes.objectOf.isRequired,
};

export default usePaymentListing;
