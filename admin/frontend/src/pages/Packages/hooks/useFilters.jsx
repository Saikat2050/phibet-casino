import React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { getAllPackages } from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import { ACTIVE_KEY_MAP } from '../../../constants/common';

const useFilters = () => {
	const dispatch = useDispatch();

	const fetchData = (values) => {
		dispatch(
			getAllPackages({
				...values,
				perPage: itemsPerPage,
				page: 1,
				orderBy: 'id',
			})
		);
	};

	const handleFilter = (values) => {
		const payload = { ...values };

		if (payload.fromDate) {
			payload.fromDate = moment(payload.fromDate).format(
				'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
			);
		}
		if (payload.toDate) {
			payload.toDate = moment(payload.toDate).format(
				'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
			);
		}
		fetchData(payload);
	};

	const { validation, formFields } = useForm({
		initialValues: filterValues(),
		validationSchema: filterValidationSchema(),
		// onSubmitEntry: handleFilter,
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
			searchInputPlaceHolder="Search by label"
		/>
	);

	return {
		filterValidation: validation,
		selectedFiltersComponent,
		filterComponent,
	};
};

export default useFilters;
