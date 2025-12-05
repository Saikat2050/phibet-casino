import React from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import { fetchAdminActivity } from '../../../store/actions';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { itemsPerPage } from '../../../constants/config';

const keyMapping = {
	searchString: 'Search',
	toDate: 'To',
	fromDate: 'From',
};

const useFilters = () => {
	const dispatch = useDispatch();
	const { adminUserId } = useParams();

	const fetchData = (values) => {
		dispatch(
			fetchAdminActivity({
				perPage: itemsPerPage,
				page: 1,
				adminUserId,
				...values,
			})
		);
	};

	const handleFilter = (values) => {
		const payload = {
			...values,
			// searchString: values.searchString?.trim() || null,
		};
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
		staticFormFields: staticFiltersFields(),
	});

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;
		let formattedValue = value;
		switch (key) {
			case 'toDate':
			case 'fromDate': {
				const date = new Date(value);
				formattedValue = date.toLocaleDateString('en-GB');
				break;
			}
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
			showSearchInput={false}
		/>
	);

	return {
		filterValidation: validation,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useFilters;
