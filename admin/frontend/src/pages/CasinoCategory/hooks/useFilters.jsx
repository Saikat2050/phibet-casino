import React from 'react';
import { useDispatch } from 'react-redux';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getCasinoCategoryDetailStart } from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';

const keyMapping = {
	searchString: 'Search',
};

const useFilters = () => {
	const dispatch = useDispatch();

	const fetchData = (values) => {
		dispatch(
			getCasinoCategoryDetailStart({
				perPage: itemsPerPage,
				page: 1,
				...values,
			})
		);
	};

	const handleFilter = (values) => {
		fetchData(values);
	};

	const { validation } = useForm({
		initialValues: filterValues(),
		validationSchema: filterValidationSchema(),
		// onSubmitEntry: handleFilter,
		staticFormFields: staticFiltersFields(),
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
			searchInputPlaceHolder="Search by Category"
			hideCustomFilter
		/>
	);

	return {
		filterValidation: validation,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useFilters;
