import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchCountriesStart,
	resetCountriesData,
} from '../../../store/actions';

const useCountriesListing = (filterValues = {}) => {
	const dispatch = useDispatch();
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const { countries, loading: isCountriesLoading } = useSelector(
		(state) => state.Countries
	);

	const fetchData = () =>
		dispatch(
			fetchCountriesStart({
				perPage: itemsPerPage,
				page: currentPage,
				...filterValues,
			})
		);

	useEffect(() => {
		fetchData();
	}, [currentPage, itemsPerPage]);

	// resetting country list redux state
	useEffect(() => () => dispatch(resetCountriesData()), []);

	const onChangeRowsPerPage = (value) => {
		setItemsPerPage(value);
	};

	const formattedCountries = useMemo(() => {
		const formattedValues = [];
		if (countries) {
			countries?.countries?.map((country) =>
				formattedValues.push({
					...country,
					countryName: country.name,
					language: country.language?.name,
					countryCode: country.code,
				})
			);
		}
		return formattedValues;
	}, [countries]);

	useEffect(() => {
		fetchData();
	}, []);

	return {
		currentPage,
		setCurrentPage,
		totalCountriesCount: countries?.totalPages,
		isCountriesLoading,
		formattedCountries,
		itemsPerPage,
		onChangeRowsPerPage,
	};
};

export default useCountriesListing;
