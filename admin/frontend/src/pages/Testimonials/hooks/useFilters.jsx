import React from 'react';
import { useDispatch } from 'react-redux';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { itemsPerPage } from '../../../constants/config';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import { ACTIVE_KEY_MAP } from '../../../constants/common';
import { filterValidationSchema, filterValues, staticFiltersFields } from '../TestimonialFormDetails';
import { getAllTestimonials } from '../../../store/actions';

const useFilters = () => {
	const dispatch = useDispatch();
	const fetchData = (values) => {
		dispatch(getAllTestimonials({ ...values, perPage: itemsPerPage, page: 1 }));
	};

	const handleFilter = (values) => {
		const payload = { ...values };
		fetchData(payload);
	};

	const { validation, formFields } = useForm({
		initialValues: filterValues(),
		validationSchema: filterValidationSchema(),
		staticFormFields: staticFiltersFields(),
	});

	const keyMapping = {
		isActive: 'Active',
		searchString: 'Search',
	};

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;
		let formattedValue = value;
		switch (key) {
			case 'isActive':
				formattedValue = ACTIVE_KEY_MAP[value] || value;
				break;
			default:
				break;
		}
		return `${formattedKey}: ${formattedValue}`;
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
			searchInputPlaceHolder="Search by author"
		/>
	);

	return {
		filterValidation: validation,
		selectedFiltersComponent,
		filterComponent,
	};
};

export default useFilters;
