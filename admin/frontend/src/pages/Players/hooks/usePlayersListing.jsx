/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchPlayersStart,
	getAllTags,
	resetPlayersData,
	updateSAUserStatus,
} from '../../../store/actions';
import {
	// CountryName,
	Email,
	// IsInternal,
	KycStatus,
	Name,
	// PhoneNumber,
	// PlayerId,
	RegistrationDate,
	Status,
	Tags,
	UniqueId,
	// Tags,
} from '../PlayersListCol';
import { getRandomColor } from '../../../helpers/common';
import { CustomSwitchButton } from '../../../helpers/customForms';
import { modules } from '../../../constants/permissions';
import { PER_PAGE } from '../../../constants/config';
import Actions from '../../../components/Common/Actions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import ButtonList from '../../../components/Common/ButtonList';
import { getDateTimeInCT } from '../../../utils/dateFormatter';

const usePlayersListing = (
	filterValues = {},
	userIds = {},
	toggleUserId = () => {},
	toggleAllUsers = () => {},
	isLocal = false
) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [itemsPerPage, setItemsPerPage] = useState(PER_PAGE);
	const [currentPage, setCurrentPage] = useState(1);
	const [isOpen, setIsOpen] = useState(false);
	const { isGranted } = usePermission();
	const { players, loading: isPlayersLoading } = useSelector(
		(state) => state.Players
	);
	const { userTags } = useSelector((state) => state.UserDetails);
	const selectedPlayers = Object.keys(userIds || {})?.map((key) => key);

	const onSuccess = () => {
		toggleUserId('', true); // clear the selected users
		setIsOpen(false);
		dispatch(
			fetchPlayersStart({
				perPage: itemsPerPage,
				page: currentPage,
				...filterValues,
			})
		);
	};

	const CheckboxInput = ({ cell }) => (
		<div>
			<CustomSwitchButton
				type="checkbox"
				containerClass="false"
				className="form-check-input"
				checked={userIds[cell?.row?.original?.id]}
				switchSizeClass="form-switch-md"
				onClick={() => toggleUserId(cell?.row?.original?.id)}
			/>
		</div>
	);
	const allUsersSelected =
		players?.users?.length > 0 &&
		players?.users?.every((user) => userIds[user.id]);

	const handleEditClick = (row) => {
		navigate(`/player-details/${row?.id}`);
	};

	const handleToggleStatus = (row) => {
		dispatch(
			updateSAUserStatus({
				userIds: [row.id],
				isActive: !row?.isActive,
				pageType: 'PlayerListing',
			})
		);
	};

	const actionsList = [
		{
			actionName: 'Edit',
			actionHandler: handleEditClick,
			isHidden: !isGranted(modules.player, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Toggle Status',
			actionHandler: handleToggleStatus,
			isHidden: !isGranted(modules.player, 'TS'),
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.success,
		},
	];

	const columns = useMemo(
		() => [
			userIds
				? {
						Header: () => (
							<CustomSwitchButton
								type="checkbox"
								name="selectAll"
								containerClass="form-switch-md"
								className="form-check-input"
								checked={allUsersSelected}
								switchSizeClass="form-switch-sm"
								onClick={() =>
									toggleAllUsers(players?.users?.map((user) => user.id))
								}
							/>
						),
						accessor: 'select',
						disableSortBy: true,
						notHidable: true,
						Cell: ({ cell }) => <CheckboxInput cell={cell} />,
				  }
				: {
						Header: '#',
						disableFilters: true,
						filterable: true,
						notHidable: true,
						disableSortBy: true,
						accessor: (prop) => {
							const { fullName, randomColor } = prop;
							return (
								<div className="avatar-xs">
									<span
										className={`avatar-title rounded-circle bg-${randomColor}-subtle text-${randomColor}`}
									>
										{fullName.charAt(0).toUpperCase()}
									</span>
								</div>
							);
						},
				  },
			// {
			// 	Header: 'Player Id',
			// 	accessor: 'id',
			// 	notHidable: true,
			// 	filterable: true,
			// 	Cell: ({ cell }) => <PlayerId value={cell.value} />,
			// },
			{
				Header: 'Email',
				accessor: 'email',
				filterable: true,
				customColumnStyle: { fontWeight: 'bold' },
				Cell: ({ cell }) => <Email cell={cell} />,
			},
			{
				Header: 'Name',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => <Name cell={cell} />,
			},
			// {
			// 	Header: 'Country',
			// 	accessor: 'country',
			// 	filterable: true,
			// 	Cell: ({ cell }) => <CountryName value={cell} />,
			// },
			// {
			// 	Header: 'Phone Number',
			// 	accessor: 'phone',
			// 	filterable: true,
			// 	Cell: ({ cell }) => <PhoneNumber value={cell.value} />,
			// },
			{
				Header: 'Segment',
				accessor: 'userTags',
				filterable: true,
				Cell: ({ cell }) => <Tags value={cell?.value} />,
			},
			{
				Header: 'UUID',
				accessor: 'uniqueId',
				filterable: true,
				Cell: ({ cell }) => <UniqueId value={cell?.value} />,
			},
			{
				Header: 'Registration Date',
				accessor: 'createdAt',
				Cell: ({ cell }) => (
					<RegistrationDate value={getDateTimeInCT(cell?.value)} />
				),
			},
			{
				Header: 'Status',
				accessor: 'status',
				filterable: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'Kyc',
				accessor: 'kycStatus',
				Cell: ({ cell }) => <KycStatus value={cell.value} />,
			},
			// {
			// 	Header: 'Is Internal',
			// 	accessor: 'isInternal',
			// 	Cell: ({ cell }) => <IsInternal value={cell.value} />,
			// },

			...(isLocal
				? [
						{
							Header: 'Action',
							accessor: 'action',
							disableSortBy: true,
							Cell: ({ cell }) => (
								<Actions actionsList={actionsList} cell={cell} />
							),
						},
				  ]
				: []),
		],
		[
			userIds,
			players,
			isGranted(modules.player, 'U'),
			isGranted(modules.player, 'TS'),
			allUsersSelected,
			isLocal,
		]
	);

	useEffect(() => {
		dispatch(
			fetchPlayersStart({
				perPage: itemsPerPage,
				page: currentPage,
				...filterValues,
			})
		);
	}, [currentPage, itemsPerPage]);

	useEffect(() => {
		if (!userTags && isGranted(modules.segmentation, 'R')) {
			dispatch(getAllTags());
		}
	}, [players, isGranted(modules.segmentation, 'R')]);

	// resetting players list redux state
	useEffect(() => () => dispatch(resetPlayersData()), []);

	const formattedPlayers = useMemo(() => {
		const formattedValues = [];
		if (players) {
			return players?.users?.map((player) => {
				const randomColor = getRandomColor();
				return {
					...player,
					fullName: `${player.firstName} ${player.lastName}`,
					status: player.isActive ? 'Active' : 'Inactive',
					isInternal: player.isInternalUser ? 'YES' : 'NO',
					userTags: player?.userTags?.map((tag) => {
						const userTag = userTags?.tags?.find(
							(tags) => tags?.id === tag?.tagId
						)?.tag;
						return userTag;
					}),
					// kycStatus: player?.kycStatus ? 'Approved' : 'Pending',
					randomColor,
				};
			});
		}
		return formattedValues;
	}, [players, userTags]);

	const onChangeRowsPerPage = (value) => {
		setCurrentPage(1);
		setItemsPerPage(value);
	};

	const handleEdit = () => {
		setIsOpen((prev) => !prev);
	};
	const buttonList = [
		{
			label: 'Edit',
			link: '',
			handleClick: handleEdit,
			module: modules.player,
			operation: 'U',
			disabled: !selectedPlayers?.length,
		},
	];

	const actionList = <ButtonList buttonList={buttonList} />;

	return {
		currentPage,
		setCurrentPage,
		totalPlayerPages: players?.totalPages,
		isPlayersLoading,
		formattedPlayers,
		itemsPerPage,
		onChangeRowsPerPage,
		columns,
		actionList,
		isOpen,
		setIsOpen,
		selectedPlayers,
		onSuccess,
	};
};

export default usePlayersListing;
