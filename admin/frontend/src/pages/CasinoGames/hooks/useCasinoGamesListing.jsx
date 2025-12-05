/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getCasinoGamesStart,
	// getCasinoProvidersDataStart,
	updateCasinoIsFeaturedStart,
	resetCasinoGamesData,
	updateCasinoStatusStart,
	updateCasinoLandingPageStart,

	// addGameStart,
	getAggregatorsList,
	getCasinoProvidersDataStart,
	getCasinoCategoryDetailStart,
} from '../../../store/actions';
import {
	// CasinoGameId,
	Name,
	Provider,
	Rtp,
	Category,
	ThumbnailUrl,
	DeviceType,
	Status,
	IsFeatured,
	LandingPage,
} from '../CasinoGamesListCol';
import { selectedLanguage } from '../../../constants/config';
import { modules } from '../../../constants/permissions';
import usePermission from '../../../components/Common/Hooks/usePermission';
import { ICON_CLASS, TEXT_COLORS } from '../../../utils/constant';
import Actions from '../../../components/Common/Actions';
import ButtonList from '../../../components/Common/ButtonList';

const useCasinoGamesListings = (filterValues = {}, onClickEdit = () => {}) => {
	const [page, setPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const dispatch = useDispatch();

	const {
		casinoGames,
		isCasinoGamesLoading,
		casinoProvidersData,
		isEditCasinoGamesSuccess,
		isAddGameLoading,
	} = useSelector((state) => state.CasinoManagementData);

	const { isGranted, permissions } = usePermission();
	const navigate = useNavigate();

	const onChangeRowsPerPage = (value) => {
		setPage(1);
		setItemsPerPage(value);
	};

	useEffect(() => {
		dispatch(getCasinoCategoryDetailStart());
		dispatch(getCasinoProvidersDataStart());
		dispatch(getAggregatorsList());
	}, [dispatch]);

	// const getProviderName = (id) =>
	// 	casinoProvidersData?.providers.find((val) => val.casinoProviderId === id)?.name;

	const formattedCasinoGames = useMemo(() => {
		if (casinoGames?.games?.length) {
			return casinoGames?.games.map((item) => ({
				...item,
				providerName: item?.casinoProvider?.name?.[selectedLanguage],
				category:
					item?.casinoGameCategories?.[0]?.casinoCategory?.name?.[
						selectedLanguage
					],
				thumbnail:
					item?.desktopImageUrl ||
					item?.thumbnailUrl?.RATIO_3_4_WEBP ||
					item?.thumbnailUrl?.RATIO_900_1344,
				// thumbnail: item?.desktopImageUrl || item?.thumbnailUrl?.RATIO_3_4_WEBP,
				devices:
					typeof item?.devices === 'object'
						? item?.devices?.join(', ')
						: item?.devices,
			}));
		}
		return [];
	}, [casinoGames, casinoProvidersData]);

	const fetchData = () => {
		dispatch(
			getCasinoGamesStart({
				perPage: itemsPerPage,
				page,
				...filterValues,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [itemsPerPage, page]);

	// resetting casino games list redux state
	useEffect(() => () => dispatch(resetCasinoGamesData()), []);

	useEffect(() => {
		if (isEditCasinoGamesSuccess) fetchData();
	}, [isEditCasinoGamesSuccess]);

	const handleStatus = (props) => {
		const { id } = props;
		dispatch(
			updateCasinoStatusStart({
				type: 'game',
				id,
			})
		);
	};

	const toggleIsFeaturedGames = (event, cell) => {
		event.preventDefault();
		const data = {
			gameId: cell.row.original.id,
		};
		dispatch(updateCasinoIsFeaturedStart(data));
	};

	const toggleLandingPageGames = (event, cell) => {
		event.preventDefault();
		const data = {
			gameId: cell.row.original.id,
		};
		dispatch(updateCasinoLandingPageStart(data));
	};

	const handleReorder = () => {
		navigate(`/casino-games/reorder`);
	};

	const handleAddGames = () => {
		navigate(`/casino-games/add-games`);
	};

	// const handleAddGames = () => {
	// 	dispatch(addGameStart());
	// };

	const buttonList = useMemo(
		() => [
			{
				label: 'Reorder',
				handleClick: handleReorder,
				link: 'reorder',
				module: modules.casinoManagement,
				operation: 'U',
			},
			{
				label: 'Add Games',
				handleClick: handleAddGames,
				// link: 'reorder',
				module: modules.casinoManagement,
				operation: 'C',
				disabled: isAddGameLoading,
			},
		],
		[isAddGameLoading]
	);
	const actionList = <ButtonList buttonList={buttonList} />;

	const handleRestrictedStates = (row) =>
		navigate(`/casino-games/restricted-states/${row?.id}`, {
			state: {
				type: 'games',
				restrictedStates: row?.restrictedStates,
			},
		});

	const actionsList = [
		{
			actionName: 'Edit',
			actionHandler: onClickEdit,
			isHidden: !isGranted(modules.casinoManagement, 'U'),
			icon: ICON_CLASS.edit,
			iconColor: TEXT_COLORS.primary,
		},
		{
			actionName: 'Toggle Status',
			actionHandler: handleStatus,
			isHidden: !isGranted(modules.casinoManagement, 'TS'),
			icon: ICON_CLASS.toggleStatus,
			iconColor: TEXT_COLORS.success,
		},
		{
			actionName: 'View Restricted States',
			actionHandler: handleRestrictedStates,
			isHidden: !isGranted(modules.casinoManagement, 'R'),
			icon: ICON_CLASS.restricted,
			iconColor: TEXT_COLORS.info,
		},
	];

	const columns = useMemo(
		() => [
			{
				Header: 'IS FEATURED',
				accessor: 'isFeatured',
				Cell: (cellProps) => (
					<IsFeatured
						toggleIsFeaturedGames={toggleIsFeaturedGames}
						isFeaturedUpdateLoading={false}
						// featuredFabData={featuredFabData}
						cellProps={cellProps}
					/>
				),
			},
			{
				Header: 'LANDING PAGE AVAILABLE',
				accessor: 'landingPage',
				Cell: (cellProps) => (
					<LandingPage
						toggleLandingPageGames={toggleLandingPageGames}
						isFeaturedUpdateLoading={false}
						// featuredFabData={featuredFabData}
						cellProps={cellProps}
					/>
				),
			},
			// {
			// 	Header: 'GAME ID',
			// 	accessor: 'id',
			// 	notHidable: true,
			// 	filterable: true,
			// 	Cell: ({ cell }) => <CasinoGameId value={cell.value} />,
			// },
			{
				Header: 'NAME',
				accessor: 'name',
				filterable: true,
				Cell: ({ cell }) => <Name value={cell.value} />,
			},
			{
				Header: 'PROVIDER',
				accessor: 'providerName',
				filterable: true,
				Cell: ({ cell }) => <Provider value={cell.value} />,
			},
			{
				Header: 'RTP',
				accessor: 'returnToPlayer',
				filterable: true,
				Cell: ({ cell }) => <Rtp value={cell.value} />,
			},
			{
				Header: 'CATEGORY',
				accessor: 'category',
				filterable: true,
				Cell: ({ cell }) => <Category value={cell.value} />,
			},
			{
				Header: 'THUMBNAIL',
				accessor: 'thumbnail',
				filterable: true,
				disableSortBy: true,
				Cell: ({ cell }) => <ThumbnailUrl value={cell.value} />,
			},
			{
				Header: 'DEVICE TYPE',
				accessor: 'devices',
				filterable: true,
				Cell: ({ cell }) => <DeviceType value={cell.value} />,
			},
			{
				Header: 'STATUS',
				accessor: 'isActive',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'ACTION',
				accessor: 'action',
				disableFilters: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Actions cell={cell} actionsList={actionsList} />,
			},
		],
		[casinoGames, permissions]
	);

	return {
		casinoGames,
		formattedCasinoGames,
		isCasinoGamesLoading,
		itemsPerPage,
		totalCasinoPages: casinoGames?.totalPages,
		onChangeRowsPerPage,
		page,
		setPage,
		handleStatus,
		toggleIsFeaturedGames,
		columns,
		actionList,
	};
};

export default useCasinoGamesListings;
