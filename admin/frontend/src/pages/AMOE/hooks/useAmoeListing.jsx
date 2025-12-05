/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import { React, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ButtonList from '../../../components/Common/ButtonList';
import { modules } from '../../../constants/permissions';
import { KeyValueCellNA, Status, UserName } from '../AmoeColList';
import { amoeStatusStart, fetchAmoeStart } from '../../../store/actions';
import Actions from '../../../components/Common/Actions';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { getDateTimeInCT } from '../../../utils/dateFormatter';

const useAmoeListing = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isGranted } = usePermission();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const { amoeRequests, loading } = useSelector((state) => state.Amoe);

	useEffect(() => {
		dispatch(
			fetchAmoeStart({
				perPage: itemsPerPage,
				page: currentPage,
			})
		);
	}, [itemsPerPage, currentPage]);

	const formattedAmoe = useMemo(
		() =>
			amoeRequests?.amoEntries?.map((amoe) => ({
				...amoe,
				username: amoe?.user?.username,
				email: amoe?.user?.email,
				entryDate: getDateTimeInCT(amoe?.entryDate),
			})) || [],
		[amoeRequests?.amoEntries]
	);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const handleAddClick = (e) => {
		e.preventDefault();
		navigate('/amoe/update-settings');
	};

	const handleStatusAmoe = (id, status) => {
		dispatch(
			amoeStatusStart({
				status,
				id,
			})
		);
	};

	const buttonList = useMemo(() => [
		{
			label: 'Settings',
			handleClick: handleAddClick,
			link: '#/',
			module: modules.amoe,
			operation: 'U',
		},
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	const actionsList = ({ status }) => [
		// {
		// 	actionName: 'Pending',
		// 	actionHandler: ({ id }) => handleStatusAmoe(id, 'pending'),
		// 	isHidden: false,
		// 	icon: ICON_CLASS.toggleStatus,
		// 	iconColor: TEXT_COLORS.primary,
		// 	isDisabled: () => status === 'pending',
		// },
		{
			actionName: 'Approved',
			actionHandler: ({ id }) => handleStatusAmoe(id, 'approved'),
			isHidden: !isGranted(modules.player, 'U'),
			icon: ICON_CLASS.markPrimary,
			iconColor: TEXT_COLORS.success,
			isDisabled: () => status !== 'pending',
		},
		{
			actionName: 'Rejected',
			actionHandler: ({ id }) => handleStatusAmoe(id, 'rejected'),
			isHidden: !isGranted(modules.player, 'U'),
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.danger,
			isDisabled: () => status !== 'pending',
		},
	];

	const columns = useMemo(
		() => [
			{
				Header: 'Username',
				accessor: 'username',
				filterable: true,
				customColumnStyle: { fontWeight: 'bold' },
				Cell: ({ cell }) => <UserName cell={cell} />,
			},
			{
				Header: 'User Id',
				accessor: 'userId',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCellNA value={cell.value} />,
			},
			{
				Header: 'Email',
				accessor: 'email',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCellNA value={cell.value} />,
			},
			{
				Header: 'Postal Code',
				accessor: 'postalCode',
				filterable: true,
				disableSortBy: true,
				Cell: ({ cell }) => <KeyValueCellNA value={cell.value} />,
			},
			{
				Header: 'Status',
				accessor: 'status',
				filterable: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Date',
				accessor: 'entryDate',
				filterable: true,
				Cell: ({ cell }) => <KeyValueCellNA value={cell.value} />,
			},
			{
				Header: 'Action',
				accessor: 'action',
				disableSortBy: true,
				Cell: ({ cell }) => {
					const onlyReadPermission = !isGranted(modules.amoe, 'U');

					return (
						<Actions
							label="Status"
							cell={cell}
							actionsList={actionsList(cell?.row?.original)}
							disabled={onlyReadPermission}
						/>
					);
				},
			},
		],
		[isGranted(modules.amoe, 'U')]
	);

	return {
		columns,
		actionList,
		formattedAmoe,
		itemsPerPage,
		setCurrentPage,
		currentPage,
		onChangeRowsPerPage,
		loading,
		totalPages: amoeRequests?.totalPages,
	};
};

export default useAmoeListing;
