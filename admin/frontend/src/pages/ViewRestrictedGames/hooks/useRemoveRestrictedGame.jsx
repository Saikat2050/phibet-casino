/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, UncontrolledTooltip } from 'reactstrap';
import {
	fetchRestrictedItemsStart,
	removeRestrictedItemsStart,
} from '../../../store/actions';
import { KeyValueCell, Status, OperatorStatus } from '../GamesListCol';
import { showToastr } from '../../../utils/helpers';

const useRemoveRestrictedGame = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { countryId } = useParams();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [removeGamesCurrentPage, setRemoveGamesCurrentPage] = useState(1);
	const [removeGamesItemsPerPage, setRemoveGamesItemsPerPage] = useState(10);
	const [selectedGames, setSelectedGames] = useState([]);

	const {
		restrictedItems: restrictedGames,
		restrictedItemsLoading: restrictedGamesLoading,
	} = useSelector((state) => state.Countries);

	useEffect(() => {
		dispatch(
			fetchRestrictedItemsStart({
				countryId,
				perPage: itemsPerPage,
				page: currentPage,
				type: 'games',
			})
		);
	}, [countryId, currentPage, itemsPerPage]);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const handleAddGame = (row) => {
		setSelectedGames((prevData) => {
			if (!prevData.find((game) => game.casinoGameId === row.casinoGameId)) {
				return [...prevData, row];
			}
			showToastr({
				message: 'Game already added',
				type: 'error',
			});
			return prevData;
		});
	};

	const handleRemoveGame = (casinoGameId) => {
		setSelectedGames((prevData) =>
			prevData.filter((game) => game.casinoGameId !== casinoGameId)
		);
	};

	const onChangeRemoveGamesRowsPerPage = (value) => {
		setRemoveGamesItemsPerPage(value);
	};

	const removeRestrictedGames = () => {
		const itemIds = selectedGames?.map((g) => g.casinoGameId);
		dispatch(
			removeRestrictedItemsStart({
				data: { type: 'games', itemIds, countryId: Number(countryId) },
				navigate,
			})
		);
	};

	const restrictedGamescolumns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'casinoGameId',
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
				Header: 'STATUS',
				accessor: 'isActive',
				filterable: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'OPERATOR STATUS',
				accessor: 'operatorStatus',
				filterable: true,
				disableSortBy: true,
				Cell: ({ cell }) => <OperatorStatus value={cell.value} />,
			},
			{
				Header: 'ACTIONS',
				accessor: 'actions',
				disableSortBy: true,
				Cell: ({ cell }) => {
					const casinoGameId = cell?.row?.original?.casinoGameId;
					return (
						<ul className="list-unstyled hstack gap-1 mb-0">
							<li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
								<Button
									type="button"
									className="btn btn-sm btn-soft-success"
									onClick={(e) => {
										e.preventDefault();
										handleAddGame(cell?.row?.original);
									}}
								>
									<i className="mdi mdi-plus-box" id={`plus-${casinoGameId}`} />
									<UncontrolledTooltip
										placement="top"
										target={`plus-${casinoGameId}`}
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

	const removeGamescolumns = useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'casinoGameId',
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
				Header: 'STATUS',
				accessor: 'isActive',
				filterable: true,
				disableSortBy: true,
				Cell: ({ cell }) => <Status value={cell.value} />,
			},
			{
				Header: 'OPERATOR STATUS',
				accessor: 'operatorStatus',
				filterable: true,
				disableSortBy: true,
				Cell: ({ cell }) => <OperatorStatus value={cell.value} />,
			},
			{
				Header: 'ACTIONS',
				accessor: 'actions',
				disableSortBy: true,
				Cell: ({ cell }) => {
					const casinoGameId = cell?.row?.original?.casinoGameId;
					return (
						<ul className="list-unstyled hstack gap-1 mb-0">
							<li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
								<Button
									type="button"
									className="btn btn-sm btn-soft-danger"
									onClick={(e) => {
										e.preventDefault();
										handleRemoveGame(casinoGameId);
									}}
								>
									<i
										className="mdi mdi-minus-box"
										id={`minus-${casinoGameId}`}
									/>
									<UncontrolledTooltip
										placement="top"
										target={`minus-${casinoGameId}`}
									>
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
		removeGamesCurrentPage,
		setRemoveGamesCurrentPage,
		removeGamesItemsPerPage,
		setRemoveGamesItemsPerPage,
		restrictedGamescolumns,
		removeGamescolumns,
		restrictedGamesList: restrictedGames?.rows || [],
		totalGamesCount: restrictedGames?.count || 0,
		restrictedGamesLoading,
		onChangeRowsPerPage,
		onChangeRemoveGamesRowsPerPage,
		selectedGames,
		removeRestrictedGames,
	};
};

export default useRemoveRestrictedGame;
