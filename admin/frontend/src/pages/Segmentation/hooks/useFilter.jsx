import React from 'react';
import { useDispatch } from 'react-redux';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import { filterValidationSchema, filterValues } from '../formDetails';
import { fetchSegmentation } from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { itemsPerPage } from '../../../constants/config';

const keyMapping = {
	searchString: 'Search',
};

const useFilters = () => {
	const dispatch = useDispatch();

	const fetchData = (values) => {
		dispatch(
			fetchSegmentation({
				perPage: itemsPerPage,
				page: 1,
				...values,
			})
		);
	};

	const handleFilter = (values) => {
		const trimmedValues = {
			...values,
			searchString: values.searchString?.trim() || null,
		};
		fetchData(trimmedValues);
	};

	const { validation } = useForm({
		initialValues: filterValues(),
		validationSchema: filterValidationSchema(),
	});

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;
		return `${formattedKey}: ${value}`;
	};

	const selectedFiltersComponent = (
		<SelectedFilters
			validation={validation}
			filterFormatter={filterFormatter}
		/>
	);

	const filterComponent = (
		<CustomFilters
			validation={validation}
			handleFilter={handleFilter}
			searchInputPlaceHolder="Search by Segment Name"
		/>
	);

	return {
		filterValidation: validation,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useFilters;
