/* eslint-disable react/prop-types */
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
	deleteBonusStart,
	getBonusesStart,
	resetBonusDetails,
	updateSABonusStatus,
} from '../../../store/actions';
import { Title, BonusType, Status, Custom } from '../BonusListCol';
import { modules } from '../../../constants/permissions';
// import { BONUS_TYPES } from '../constants';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import Actions from '../../../components/Common/Actions';
import ButtonList from '../../../components/Common/ButtonList';

const useBonusListing = (filterValues = {}) => {
	const { bonusDetails, isLoading, isDeleteBonusLoading } = useSelector(
		(state) => state.AllBonusDetails
	);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const { isGranted, permissions } = usePermission();
	const [page, setPage] = useState(1);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onChangeRowsPerPage = (value) => {
		setPage(1);
		setItemsPerPage(value);
	};

	const formattedBonusDetails = useMemo(() => {
		if (bonusDetails?.bonus?.length) {
			return bonusDetails?.bonus.map((bonus) => {
				const isExpired =
					moment(bonus.validTill).valueOf() < moment().valueOf() ? 'Yes' : 'No';
				return {
					...bonus,
					isExpired,
				};
			});
		}
		return [];
	}, [bonusDetails]);

	const fetchData = () => {
		dispatch(
			getBonusesStart({
				perPage: itemsPerPage,
				page,
				...filterValues,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [page, itemsPerPage]);

	// resetting bonus listing redux state
	useEffect(() => () => dispatch(resetBonusDetails()), []);

	const handleStatus = (props) => {
		const { id } = props;
		dispatch(
			updateSABonusStatus({
				bonusId: id,
			})
		);
	};

	const handleClose = () => {
		fetchData();
	};

	const bonusDeleteHandler = (bonusId) => {
		dispatch(
			deleteBonusStart({
				data: {
					bonusId,
				},
				handleClose,
			})
		);
	};

	const handleView = (props) => {
		const { id, bonusType } = props;
		navigate(`/bonus/${id}/${bonusType}`);
	};

	// const handleAddClick = (e) => {
	// 	e.preventDefault();
	// 	navigate('/bonus/create');
	// };

	const buttonList = useMemo(() => [
		// {
		// 	label: 'Create',
		// 	handleClick: handleAddClick,
		// 	link: '#!',
		// 	module: modules.bonus,
		// 	operation: 'C',
		// },
		// {
		// 	label: 'Reorder',
		// 	handleClick: '',
		// 	link: 'reorder',
		// 	module: modules.bonus,
		// 	operation: 'U',
		// },
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	const handleEdit = (row) =>
		navigate(`/bonus/edit/${row?.id}/${row?.bonusType}`);

	const isDisabled = () => {};

	const actionsList = () => [
		{
			actionName: 'View',
			actionHandler: handleView,
			isHidden: !isGranted(modules.bonus, 'R'),
			icon: ICON_CLASS.view,
			iconColor: TEXT_COLORS.info,
		},
		{
			actionName: 'Edit',
			actionHandler: handleEdit,
			isHidden: !isGranted(modules.bonus, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
			isDisabled,
		},
		{
			actionName: 'Toggle Status',
			actionHandler: handleStatus,
			isHidden: !isGranted(modules.bonus, 'TS'),
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.success,
		},
		// {
		// 	actionName: 'Delete',
		// 	actionHandler: handleDelete,
		// 	isHidden:
		// 		!isGranted(modules.bonus, 'D') || bonusType === BONUS_TYPES.POSTAL_CODE,
		// 	icon: ICON_CLASS.delete,
		// 	iconColor: TEXT_COLORS.delete,
		// 	isDisabled,
		// },
	];

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'Id',
			// 	accessor: 'id',
			// 	filterable: true,
			// 	Cell: ({ cell }) => <BonusId value={cell.value} />,
			// },
			{
				Header: 'Title',
				accessor: 'promotionTitle',
				filterable: true,
				Cell: ({ cell }) => <Title value={cell.value} />,
			},
			{
				Header: 'Bonus Type',
				accessor: 'bonusType',
				filterable: true,
				Cell: ({ cell }) => <BonusType value={cell.value} />,
			},
			// {
			// 	Header: 'Days To Clear',
			// 	accessor: 'daysToClear',
			// 	filterable: true,
			// 	Cell: ({ cell }) => (
			// 		<Custom
			// 			value={
			// 				[BONUS_TYPES.JOINING, BONUS_TYPES.POSTAL_CODE]?.includes(
			// 					cell?.row?.original?.bonusType
			// 				)
			// 					? '-'
			// 					: cell.value
			// 			}
			// 		/>
			// 	),
			// },
			{
				Header: 'Claimed Count',
				accessor: 'claimedCount',
				filterable: true,
				Cell: ({ cell }) => <Custom value={cell.value} />,
			},
			// {
			// 	Header: 'Valid From',
			// 	accessor: 'validFrom',
			// 	filterable: true,
			// 	Cell: ({ cell }) => (
			// 		<Date
			// 			value={
			// 				[
			// 					BONUS_TYPES.JOINING,
			// 					BONUS_TYPES.POSTAL_CODE,
			// 					BONUS_TYPES.DAILY,
			// 				]?.includes(cell?.row?.original?.bonusType)
			// 					? ''
			// 					: cell.value
			// 			}
			// 		/>
			// 	),
			// },
			// {
			// 	Header: 'Valid Till',
			// 	accessor: 'validTo',
			// 	filterable: true,
			// 	Cell: ({ cell }) => (
			// 		<Date
			// 			value={
			// 				[
			// 					BONUS_TYPES.JOINING,
			// 					BONUS_TYPES.POSTAL_CODE,
			// 					BONUS_TYPES.DAILY,
			// 				]?.includes(cell?.row?.original?.bonusType)
			// 					? ''
			// 					: cell.value
			// 			}
			// 		/>
			// 	),
			// },
			// {
			// 	Header: 'Is Expired',
			// 	accessor: 'isExpired',
			// 	filterable: true,
			// 	Cell: ({ cell }) => <Custom value={[BONUS_TYPES.JOINING, BONUS_TYPES.POSTAL_CODE]?.includes(cell?.row?.original?.bonusType)
			// 		? '-' : cell.value} />,
			// },
			{
				Header: 'Status',
				accessor: 'isActive',
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Actions',
				accessor: 'actions',
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => (
					<Actions
						cell={cell}
						actionsList={actionsList(cell.row.original.bonusType)}
					/>
				),
			},
		],
		[formattedBonusDetails, permissions]
	);

	return {
		bonusDetails,
		formattedBonusDetails,
		isLoading,
		totalBonusCount: bonusDetails?.count,
		itemsPerPage,
		page,
		setPage,
		onChangeRowsPerPage,
		columns,
		bonusDeleteHandler,
		isDeleteBonusLoading,
		actionList,
	};
};

export default useBonusListing;
