/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRestrictedItemsStart } from '../../../store/actions';
import { KeyValueCell, Status, OperatorStatus } from '../GamesListCol';

const useRestrictedGamesListing = () => {
	const dispatch = useDispatch();
	const { countryId } = useParams();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

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

	const columns = useMemo(() => [
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
	]);

	return {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		columns,
		restrictedGamesList: restrictedGames?.rows || [],
		totalGamesCount: restrictedGames?.count || 0,
		restrictedGamesLoading,
		onChangeRowsPerPage,
	};
};

export default useRestrictedGamesListing;
