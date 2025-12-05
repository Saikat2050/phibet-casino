/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Custom, LevelId, Icon } from '../VipTiersListCol';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import Actions from '../../../components/Common/Actions';
import { getVIPTierStart } from '../../../store/actions';
import ButtonList from '../../../components/Common/ButtonList';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from 'reactstrap';

const useVipTiersListing = (filterValues = {}) => {
	const { vipTiers, vipTiersLoading } = useSelector((state) => state.VIPTiers);
	const { isGranted, permissions } = usePermission();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const [page, setPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const onChangeRowsPerPage = (value) => {
		setPage(1);
		setItemsPerPage(value);
	};

	// useEffect(() => {
	// 	if (location.pathname === '/payment') fetchData();
	// }, [location, page, itemsPerPage]);

	// const fetchMoreData = () => {
	// 	setPage((prev) => prev + 1);
	// 	dispatch(
	// 		getVIPTierStart(
	// 			{
	// 				perPage: 10,
	// 				page: page + 1,
	// 				...filterValues,
	// 			},
	// 			'MoreData'
	// 		)
	// 	);
	// };

	const fetchData = () => {
		// dispatch(getVIPTierStart());

		dispatch(
			getVIPTierStart({
				perPage: itemsPerPage,
				page,
				...filterValues,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [page, itemsPerPage]);

	// const handleView = (props) => {
	// 	console.log(props, "handleView pppppppppppppp");

	// 	// const { id } = props;
	// 	// navigate(`/view/vip-tier/${id}`);
	// };

	// const onClickEdit = (props) => {
	// 	console.log(props, "onClickEdit pppppppppppppp");
	// 	// const { id } = props
	// 	// navigate(`/edit/vip-tier/${id}`);
	// };

	const buttonList = useMemo(() => [
		{
			label: 'Add',
			link: '/vip/add',
			handleClick: () => {
				navigate('/vip/add');
			},
			module: modules.player,
			operation: 'U',
		},
		// {
		// 	actionName: 'Edit',
		// 	actionHandler: onClickEdit,
		// 	isHidden: !isGranted(modules.bonus, 'U'),
		// 	icon: ICON_CLASS.edit,
		// 	iconColor: TEXT_COLORS.primary
		// },
		// {
		// 	actionName: 'View',
		// 	actionHandler: handleView,
		// 	isHidden: !isGranted(modules.bonus, 'R'),
		// 	icon: ICON_CLASS.view,
		// 	iconColor: TEXT_COLORS.info,
		// },
		// {
		// 	actionName: 'Edit',
		// 	actionHandler: onClickEdit,
		// 	isHidden: !isGranted(modules.bonus, 'U'),
		// 	icon: ICON_CLASS.edit,
		// 	iconColor: TEXT_COLORS.primary
		// },
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	const tableActions = (row) => [
		{
			actionName: 'View',
			actionHandler: () => {
				navigate(`details/${row?.id}`);
			},
			isHidden: false,
			icon: ICON_CLASS.view,
			iconColor: TEXT_COLORS.info,
		},
		{
			actionName: 'Edit',
			actionHandler: () => {
				navigate(`edit/${row?.id}`);
			},
			isHidden: !isGranted(modules.vip, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		// {
		// 	actionName: 'Toggle Status',
		// 	actionHandler: handleToggleStatus,
		// 	isHidden: false,
		// 	icon: ICON_CLASS.toggleStatus,
		// 	iconColor: TEXT_COLORS.success,
		// },
	];

	const columns = useMemo(
		() => [
			{
				Header: 'Tier Id',
				accessor: 'id',
				filterable: true,
				Cell: ({ cell }) => <LevelId value={cell.value} />,
			},
			{
				Header: 'Level',
				accessor: 'level',
				filterable: true,
				Cell: ({ cell }) => <Custom value={cell.value} />,
			},
			{
				Header: 'Level Name',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => <Custom value={cell.value} />,
			},
			{
				Header: 'XP Requirement',
				accessor: 'xpRequirement',
				filterable: true,
				Cell: ({ cell }) => <Custom value={cell.value} />,
			},
			// {
			// 	Header: 'Icon',
			// 	accessor: 'icon',
			// 	filterable: true,
			// 	disableSortBy: true,
			// 	Cell: ({ cell }) => <Icon value={cell.value} />,
			// },
			// {
			// 	Header: 'Status',
			// 	accessor: 'status',
			// 	filterable: true,
			// 	Cell: ({ cell }) => <Custom value={cell.value} />,
			// },
			{
				Header: 'Status',
				accessor: 'status',
				filterable: true,
				Cell: ({ row }) => {
					const { isActive } = row.original;
					return (
						<span
							style={{
								color: isActive ? 'green' : 'red',
								fontWeight: 'bold',
							}}
						>
							{isActive ?? '' ? (
								<Badge className="bg-success">Active</Badge>
							) : (
								<Badge className="bg-danger">In Active</Badge>
							)}
						</span>
					);
				},
			},
			{
				Header: 'Actions',
				accessor: 'actions',
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => (
					<Actions
						cell={cell}
						actionsList={tableActions(cell?.row?.original)}
					/>
				),
			},
		],
		// []
		[vipTiers?.vipTiers, isGranted(modules.vip, 'U')]
	);

	return {
		isLoading: vipTiersLoading,
		columns,
		totalPages: vipTiers?.totalPages,
		vipTiers: vipTiers?.vipTiers || [],
		onChangeRowsPerPage,
		itemsPerPage,
		setPage,
		page,
		actionList,
		navigate,
	};
};

export default useVipTiersListing;
