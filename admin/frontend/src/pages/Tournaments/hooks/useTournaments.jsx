/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import {
	Date as DateComponent,
	// Id,
	Name,
	// NonSettled,
	StatusBadge,
} from '../TournamentListCol';
import { modules } from '../../../constants/permissions';
import useFilters from './useFilters';
import {
	getTournamentDetailsStart,
	updateTournamentStart,
	updateTournamentStatusStart,
} from '../../../store/tournaments/actions';
import { ThumbnailUrl } from '../../CasinoGames/CasinoGamesListCol';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import Actions from '../../../components/Common/Actions';
import { useConfirmModal } from '../../../components/Common/ConfirmModal';
import ButtonList from '../../../components/Common/ButtonList';

const useTournaments = () => {
	const dispatch = useDispatch();
	const { openConfirmModal } = useConfirmModal();
	const navigate = useNavigate();
	const { isGranted, permissions } = usePermission();

	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const { filterValidation, filterComponent, selectedFiltersComponent } =
		useFilters(itemsPerPage);

	const { tournamentsInfo, isTournamentsInfoLoading, updateTournament } =
		useSelector((state) => state.Tournament);

	const fetchData = () => {
		const data = {
			perPage: itemsPerPage,
			page: currentPage,
			...filterValidation?.values,
		};

		if (filterValidation?.values?.endDate) {
			data.endDate =
				moment(filterValidation?.values?.endDate)
					.utc()
					.clone()
					.add(1, 'days')
					.format() || '';
		}
		dispatch(getTournamentDetailsStart(data));
	};

	useEffect(() => {
		fetchData();
	}, [currentPage, itemsPerPage]);

	useEffect(() => {
		if (updateTournament) {
			fetchData();
		}
	}, [updateTournament]);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const handleEdit = (row) => {
		navigate(`/tournaments/edit/${row?.id}`);
	};

	const handleView = (row) => {
		navigate(`/tournaments/view/${row?.id}`);
	};

	const handleStatus = (row) => {
		dispatch(
			updateTournamentStatusStart({
				tournamentId: row?.id,
			})
		);
	};

	const acceptSettleToggle = (id) => {
		dispatch(
			updateTournamentStart({
				data: {
					tournamentId: id,
					type: 'settled',
				},
			})
		);
	};

	const acceptStatusToggle = (tournamentId) => {
		dispatch(
			updateTournamentStart({
				data: {
					type: 'cancelled',
					tournamentId,
				},
			})
		);
	};

	const isDisabled = (row) => {
		const isSettled = row?.status === 'settled';
		const isCancelled = row?.status === 'cancelled';
		const isRegistrationEnded = row?.registrationEndDate
			? new Date(row?.registrationEndDate).getTime() < new Date().getTime()
			: false;

		return isSettled || isCancelled || isRegistrationEnded;
	};

	const isCancelDisable = (row) => {
		const isSettled = row?.status === 'settled';
		const isCancelled = row?.status === 'cancelled';

		return isSettled || isCancelled;
	};

	const handleCancel = (row) =>
		openConfirmModal('Do You Really Want to Cancel this Tournament?', () =>
			acceptStatusToggle(row?.id)
		);

	const handleSettleClick = (row) =>
		row?.status !== 'settled' &&
		openConfirmModal('Do You Really Want to Settle this Tournament?', () =>
			acceptSettleToggle(row?.id)
		);

	const actionsList = [
		{
			actionName: 'View',
			actionHandler: handleView,
			isHidden: !isGranted(modules.tournamentManagement, 'R'),
			icon: ICON_CLASS.view,
			iconColor: TEXT_COLORS.info,
		},
		{
			actionName: 'Edit',
			actionHandler: handleEdit,
			isHidden: !isGranted(modules.tournamentManagement, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
			isDisabled,
		},
		{
			actionName: 'Toggle Status',
			actionHandler: handleStatus,
			isHidden: !isGranted(modules.tournamentManagement, 'TS'),
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.success,
			isDisabled,
		},
		{
			actionName: 'Settle',
			actionHandler: handleSettleClick,
			isHidden: !isGranted(modules.tournamentManagement, 'R'),
			icon: ICON_CLASS.settle,
			iconColor: TEXT_COLORS.primary,
			isDisabled: isCancelDisable,
		},
		{
			actionName: 'Cancel',
			actionHandler: handleCancel,
			isHidden: !isGranted(modules.tournamentManagement, 'U'),
			icon: ICON_CLASS.restricted,
			iconColor: TEXT_COLORS.danger,
			isDisabled: isCancelDisable,
		},
	];

	const columns = useMemo(
		() => [
			// {
			// 	Header: 'ID',
			// 	accessor: 'id',
			// 	// filterable: true,
			// 	Cell: ({ cell }) => <Id value={cell.value} />,
			// },
			{
				Header: 'NAME',
				accessor: 'name',
				// filterable: true,
				Cell: ({ cell }) => <Name value={cell.value.EN} />,
			},
			// {
			// 	Header: 'TOURNAMENT PERIOD',
			// 	accessor: 'tournamentPeriod',
			// 	// filterable: true,
			// 	Cell: ({ cell }) => <TournamentPeriod value={cell.value} />,
			// },
			{
				Header: 'Thumbnail',
				accessor: 'image',
				// filterable: true,
				Cell: ({ cell }) => <ThumbnailUrl value={cell.value} />,
			},
			{
				Header: 'START DATE',
				accessor: 'startDate',
				// filterable: true,
				Cell: ({ cell }) => <DateComponent value={cell.value} />,
			},
			{
				Header: 'END DATE',
				accessor: 'endDate',
				// filterable: true,
				Cell: ({ cell }) => <DateComponent value={cell.value} />,
			},
			// {
			// 	Header: 'Image',
			// 	accessor: 'image',
			// 	// filterable: true,
			// 	Cell: ({ cell }) => <Image value={cell.value} />,
			// },
			{
				Header: 'REGISTRATION CLOSE DATE',
				accessor: 'registrationEndDate',
				// filterable: true,
				Cell: ({ cell }) => <DateComponent value={cell.value} />,
			},
			// {
			// 	Header: 'SETTLE',
			// 	accessor: 'isSettled',
			// 	// filterable: true,
			// 	Cell: ({ cell }) => (
			// 		<NonSettled cell={cell} setShowSettleModal={setShowSettleModal} />
			// 	),
			// },
			{
				Header: 'STATUS',
				accessor: 'status',
				// filterable: true,
				Cell: ({ cell }) => <StatusBadge value={cell.value} />,
			},
			{
				Header: 'ACTION',
				accessor: 'actions',
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => <Actions actionsList={actionsList} cell={cell} />,
			},
		],
		[tournamentsInfo, permissions]
	);

	const handleAddClick = (e) => {
		e.preventDefault();
		navigate('create');
	};

	const buttonList = useMemo(() => [
		{
			label: 'Create',
			handleClick: handleAddClick,
			link: '#!',
			module: modules.tournamentManagement,
			operation: 'C',
		},
	]);

	const actionList = <ButtonList buttonList={buttonList} />;

	return {
		itemsPerPage,
		setItemsPerPage,
		currentPage,
		setCurrentPage,
		onChangeRowsPerPage,
		totalPages: tournamentsInfo?.totalPages,
		tournamentsInfo,
		columns,
		actionList,
		isTournamentsInfoLoading,
		acceptSettleToggle,
		acceptStatusToggle,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useTournaments;
