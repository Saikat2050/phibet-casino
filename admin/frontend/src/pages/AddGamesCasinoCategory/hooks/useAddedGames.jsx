/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { KeyValueCell, Status } from '../GamesListCol';
import { getAddedGameInCategoryStart } from '../../../store/actions';
import { selectedLanguage } from '../../../constants/config';

const useAddedGames = () => {
	const dispatch = useDispatch();
	const { categoryId } = useParams();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const { categoryAddedGames, isCategoryAddedGamesLoading } = useSelector(
		(state) => state.CasinoManagementData
	);

	useEffect(() => {
		if (categoryId) {
			dispatch(
				getAddedGameInCategoryStart({
					casinoCategoryId: categoryId,
					perPage: itemsPerPage,
					page: currentPage,
				})
			);
		}
	}, [categoryId, currentPage, itemsPerPage]);

	const formattedGames = useMemo(() => {
		if (categoryAddedGames?.games?.length) {
			return categoryAddedGames?.games?.map((game) => ({
				...game,
				providerName: game?.casinoProvider?.name?.[selectedLanguage],
				name: game.name[selectedLanguage],
				devices: Array.isArray(game.devices)
					? game.devices.join(', ')
					: game.devices,
			}));
		}
		return [];
	}, [categoryAddedGames]);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const columns = useMemo(() => [
		{
			Header: 'ID',
			accessor: 'id',
			notHidable: true,
			filterable: true,
			Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
		},
		{
			Header: 'NAME',
			accessor: 'name',
			filterable: true,
			Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
		},
		{
			Header: 'PROVIDER NAME',
			accessor: 'providerName',
			filterable: true,
			disableSortBy: true,
			Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
		},
		{
			Header: 'DEVICE TYPE',
			accessor: 'devices',
			filterable: true,
			disableSortBy: true,
			Cell: ({ cell }) => <KeyValueCell value={cell.value} />,
		},
		{
			Header: 'STATUS',
			accessor: 'isActive',
			filterable: true,
			disableSortBy: true,
			Cell: ({ cell }) => <Status value={cell.value} />,
		},
	]);

	return {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		columns,
		formattedGames,
		totalGamesCount: categoryAddedGames?.totalPages || 0,
		isCategoryAddedGamesLoading,
		onChangeRowsPerPage,
	};
};

export default useAddedGames;
