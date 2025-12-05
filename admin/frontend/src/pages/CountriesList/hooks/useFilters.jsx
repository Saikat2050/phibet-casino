import React from 'react';
import { useDispatch } from 'react-redux';
import { filterValidationSchema, filterValues } from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { fetchCountriesStart } from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';

const keyMapping = {
	searchString: 'Search',
};

const useFilters = () => {
	const dispatch = useDispatch();

	const fetchData = (values) => {
		dispatch(
			fetchCountriesStart({
				perPage: itemsPerPage,
				page: 1,
				...values,
			})
		);
	};

	const handleFilter = (values) => {
		fetchData(values);
	};

	const { validation, formFields } = useForm({
		initialValues: filterValues(),
		validationSchema: filterValidationSchema(),
		staticFormFields: [],
	});

	const selectedFiltersComponent = (
		<SelectedFilters
			validation={validation}
			filterFormatter={(key, value) => `${keyMapping[key] || key}: ${value}`}
		/>
	);

	const filterComponent = (
		<CustomFilters
			filterFields={formFields}
			validation={validation}
			handleFilter={handleFilter}
			searchInputPlaceHolder="Search by country name"
		/>
	);

	return {
		filterFields: formFields,
		filterValidation: validation,
		filterValues,
		handleFilter,
		selectedFiltersComponent,
		filterComponent,
	};
};

export default useFilters;
