import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getCasinoProvidersDataStart,
	resetCasinoProvidersData,
} from '../../../store/actions';

const useCasinoProvidersListing = (filterValues = {}) => {
	const {
		casinoProvidersData,
		isCasinoProvidersDataLoading,
		isCreateProviderSuccess,
		isEditProviderSuccess,
	} = useSelector((state) => state.CasinoManagementData);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const onChangeRowsPerPage = (value) => {
		setPage(1);
		setItemsPerPage(value);
	};

	const fetchData = () => {
		dispatch(
			getCasinoProvidersDataStart({
				perPage: itemsPerPage,
				page,
				...filterValues,
			})
		);
	};

	useEffect(() => {
		fetchData();
	}, [limit, page, itemsPerPage]);

	// resetting providers list redux state
	useEffect(() => () => dispatch(resetCasinoProvidersData()), []);

	useEffect(() => {
		if (isCreateProviderSuccess || isEditProviderSuccess) fetchData();
	}, [isCreateProviderSuccess, isEditProviderSuccess]);

	return {
		casinoProvidersData,
		isCasinoProvidersDataLoading,
		itemsPerPage,
		limit,
		setLimit,
		page,
		setPage,
		onChangeRowsPerPage,
	};
};

export default useCasinoProvidersListing;
