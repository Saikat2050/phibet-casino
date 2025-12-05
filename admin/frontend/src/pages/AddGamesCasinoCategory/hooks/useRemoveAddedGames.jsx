/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, UncontrolledTooltip } from 'reactstrap';
import {
	getAddedGameInCategoryStart,
	removeGameFromCategoryStart,
} from '../../../store/actions';
import { KeyValueCell, Status } from '../GamesListCol';
import { showToastr } from '../../../utils/helpers';
import { selectedLanguage } from '../../../constants/config';

const useRemoveAddedGames = () => {
	const dispatch = useDispatch();
	const { categoryId } = useParams();
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [removedGamesCurrentPage, setRemovedGamesCurrentPage] = useState(1);
	const [removedGamesItemsPerPage, setRemovedGamesItemsPerPage] = useState(10);
	const [selectedGames, setSelectedGames] = useState([]);

	const { categoryAddedGames, isCategoryAddedGamesLoading } = useSelector(
		(state) => state.CasinoManagementData
	);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const handleAddGame = (row) => {
		setSelectedGames((prevData) => {
			if (!prevData.find((game) => game.id === row.id)) {
				return [...prevData, row];
			}
			showToastr({
				message: 'Provider already added',
				type: 'error',
			});
			return prevData;
		});
	};

	const handleRemoveGame = (id) => {
		setSelectedGames((prevData) => prevData.filter((game) => game.id !== id));
	};

	const onChangeRemoveGamesRowsPerPage = (value) => {
		setRemovedGamesItemsPerPage(value);
	};

	const removeAddedGames = () => {
		const itemIds = selectedGames?.map((g) => g.id);
		dispatch(
			removeGameFromCategoryStart({
				gameIds: itemIds,
				categoryId,
				navigate,
			})
		);
	};

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
				name: game.name[selectedLanguage],
				providerName: game?.casinoProvider?.name[selectedLanguage],
				devices: Array.isArray(game.devices)
					? game.devices.join(', ')
					: game.devices,
			}));
		}
		return [];
	}, [categoryAddedGames]);

	const columns = useMemo(
		() => [
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
			{
				Header: 'ACTIONS',
				accessor: 'actions',
				disableSortBy: true,
				Cell: ({ cell }) => {
					const gameId = cell?.row?.original?.id;
					return (
						<ul className="list-unstyled hstack gap-1 mb-0">
							<li data-bs-toggle="tooltip" data-bs-placement="top">
								<Button
									type="button"
									className="btn btn-sm btn-soft-success"
									onClick={(e) => {
										e.preventDefault();
										handleAddGame(cell?.row?.original);
									}}
								>
									<i className="mdi mdi-plus-box" id={`plus-${gameId}`} />
									<UncontrolledTooltip
										placement="top"
										target={`plus-${gameId}`}
									>
										Add this Game
									</UncontrolledTooltip>
								</Button>
							</li>
						</ul>
					);
				},
			},
		],
		[]
	);

	const removeGamecolumns = useMemo(
		() => [
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
			{
				Header: 'ACTIONS',
				accessor: 'actions',
				disableSortBy: true,
				Cell: ({ cell }) => {
					const id = cell?.row?.original?.id;
					return (
						<ul className="list-unstyled hstack gap-1 mb-0">
							<li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
								<Button
									type="button"
									className="btn btn-sm btn-soft-danger"
									onClick={(e) => {
										e.preventDefault();
										handleRemoveGame(id);
									}}
								>
									<i className="mdi mdi-minus-box" id={`minus-${id}`} />
									<UncontrolledTooltip placement="top" target={`minus-${id}`}>
										Remove this Game
									</UncontrolledTooltip>
								</Button>
							</li>
						</ul>
					);
				},
			},
		],
		[]
	);

	return {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		removedGamesCurrentPage,
		setRemovedGamesCurrentPage,
		removedGamesItemsPerPage,
		setRemovedGamesItemsPerPage,
		removeGamecolumns,
		onChangeRowsPerPage,
		onChangeRemoveGamesRowsPerPage,
		selectedGames,
		removeAddedGames,
		columns,
		formattedGames,
		totalGamesCount: categoryAddedGames?.totalPages || 0,
		isCategoryAddedGamesLoading,
	};
};

export default useRemoveAddedGames;
