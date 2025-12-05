/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRestrictedItemsStart } from '../../../store/actions';
import { KeyValueCell, Status } from '../GamesListCol';

const useRestrictedProvidersListing = () => {
	const dispatch = useDispatch();
	const { countryId } = useParams();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const {
		restrictedItems: restrictedProviders,
		restrictedGamesLoading: restrictedProvidersLoading,
	} = useSelector((state) => state.Countries);

	useEffect(() => {
		dispatch(
			fetchRestrictedItemsStart({
				countryId,
				perPage: itemsPerPage,
				page: currentPage,
				type: 'providers',
			})
		);
	}, [countryId, currentPage, itemsPerPage]);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const columns = useMemo(() => [
		{
			Header: 'ID',
			accessor: 'casinoProviderId',
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
	]);

	return {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		columns,
		restrictedProvidersList: restrictedProviders?.rows || [],
		totalProvidersCount: restrictedProviders?.count || 0,
		restrictedProvidersLoading,
		onChangeRowsPerPage,
	};
};

export default useRestrictedProvidersListing;
