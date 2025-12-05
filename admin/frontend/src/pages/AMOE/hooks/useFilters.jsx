import React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
	STATUS_VALUE_LABEL,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { fetchAmoeStart } from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import { ACTIVE_KEY_MAP } from '../../../constants/common';

const useFilters = () => {
	const dispatch = useDispatch();

	const fetchData = (values) => {
		dispatch(
			fetchAmoeStart({
				perPage: itemsPerPage,
				page: 1,
				...values,
			})
		);
	};

	const handleFilter = (values) => {
		const searchValue = values.searchString;
		const payload = { ...values };

		if (searchValue) {
			if (/^\d+$/.test(searchValue)) {
				payload.userId = searchValue;
				delete payload.searchString;
			} else {
				payload.searchString = searchValue;
			}
		}

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
		status: 'Status',
		toDate: 'To',
		fromDate: 'From',
		userId: 'User Id',
		searchString: 'Username/Name',
	};
	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;
		let formattedValue = value;
		switch (key) {
			case 'isActive':
				formattedValue = ACTIVE_KEY_MAP[value] || value;
				break;
			case 'toDate':
			case 'fromDate': {
				const date = new Date(value);
				formattedValue = date.toLocaleDateString('en-GB');
				break;
			}
			case 'status': {
				formattedValue = STATUS_VALUE_LABEL[value];
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
			searchInputName="searchString"
			searchInputPlaceHolder="Search by User ID, Username or Email"
		/>
	);

	return {
		filterValidation: validation,
		selectedFiltersComponent,
		filterComponent,
	};
};

export default useFilters;
