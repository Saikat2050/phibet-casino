import React from 'react';
import { useDispatch } from 'react-redux';
import { filterValidationSchema, filterValues } from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { fetchStatesStart } from '../../../store/actions';
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
			fetchStatesStart({
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
			validation={validation}
			handleFilter={handleFilter}
			searchInputPlaceHolder="Search by State Name"
		/>
	);

	return {
		filterValidation: validation,
		selectedFiltersComponent,
		filterComponent,
	};
};

export default useFilters;
