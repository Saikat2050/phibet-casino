import React from 'react';
import { useDispatch } from 'react-redux';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getChannels } from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';
import CustomFilters from '../../../components/Common/CustomFilters';
import SelectedFilters from '../../../components/Common/SelectedFilters';

const keyMapping = {
	searchName: 'Search',
};

const useFilters = () => {
	const dispatch = useDispatch();

	const fetchData = (values) => {
		dispatch(
			getChannels({
				limit: itemsPerPage,
				pageNo: 1,
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
			filterFields={formFields}
			validation={validation}
			handleFilter={handleFilter}
			searchInputPlaceHolder="Search by name"
			searchInputName="searchName"
		/>
	);

	return {
		filterValidation: validation,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useFilters;
