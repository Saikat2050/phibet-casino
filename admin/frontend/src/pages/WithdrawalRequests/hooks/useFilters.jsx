/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomFilters from '../../../components/Common/CustomFilters';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { PER_PAGE } from '../../../constants/config';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import { fetchWithdrawRequestsStart, getAllTags } from '../../../store/actions';

const keyMapping = {
	status: 'Status',
};

const useFilters = () => {
	const dispatch = useDispatch();
	const { userTags } = useSelector((state) => state.UserDetails);

	const fetchData = (values) => {
		dispatch(
			fetchWithdrawRequestsStart({
				perPage: PER_PAGE,
				page: 1,
				...values,
			})
		);
	};

	const handleFilter = (values) => {
		fetchData(values);
	};

	const { validation, formFields, setFormFields } = useForm({
		initialValues: filterValues(),
		validationSchema: filterValidationSchema(),
		staticFormFields: staticFiltersFields(),
		enableReinitialize: false,
	});

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;
		const formattedValue = value;

		return `${formattedKey}: ${formattedValue}`;
	};

	const handleResetCallback = () => {
		validation.resetForm({
			values: {
				...filterValues(),
			},
		});
	};

	useEffect(() => {
		if (!userTags) {
			dispatch(getAllTags());
		}
	}, []);

	useEffect(() => {
		const tags = userTags?.tags?.map((row) => ({
			optionLabel: row?.tag,
			value: row.id,
		}));

		setFormFields([
			...staticFiltersFields(),
			{
				name: 'tagId',
				fieldType: 'select',
				label: '',
				placeholder: 'Select Segment',
				optionList: tags,
			},
		]);
	}, [userTags]);

	const selectedFiltersComponent = (
		<SelectedFilters
			validation={validation}
			filterFormatter={filterFormatter}
			handleResetCallback={handleResetCallback}
		/>
	);

	const filterComponent = (
		<CustomFilters
			filterFields={formFields}
			validation={validation}
			handleFilter={handleFilter}
			// showSearchInput={true}
			searchInputPlaceHolder="Search by Transaction Id"
		/>
	);

	return {
		filterValidation: validation,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useFilters;
