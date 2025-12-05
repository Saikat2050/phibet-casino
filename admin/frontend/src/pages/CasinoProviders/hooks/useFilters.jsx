import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	getCasinoProvidersDataStart,
	getAggregatorsList,
} from '../../../store/actions';
import { itemsPerPage } from '../../../constants/config';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
// import { ACTIVE_KEY_MAP } from '../../../constants/common';

const keyMapping = {
	// searchString: 'Search',
	aggregatorId: 'Aggregator',
};

const useFilters = () => {
	const dispatch = useDispatch();

	const { aggregatorsData } = useSelector((state) => state.AggregatorsReducer);

	const aggregatorOptions = useMemo(
		() =>
			aggregatorsData?.aggregators?.map((agg) => ({
				value: agg.id,
				label: agg.name?.EN || 'Unnamed',
			})) || [],
		[aggregatorsData]
	);

	const fetchData = (values) => {
		dispatch(
			getCasinoProvidersDataStart({
				perPage: itemsPerPage,
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
		// onSubmitEntry: handleFilter,
		staticFormFields: staticFiltersFields(),
	});

	useEffect(() => {
		dispatch(getAggregatorsList());
	}, []);

	useEffect(() => {
		if (aggregatorsData?.aggregators) {
			setFormFields([
				...staticFiltersFields(),
				{
					name: 'aggregatorId',
					fieldType: 'select',
					label: '',
					placeholder: 'Aggregator',
					optionList: aggregatorOptions.map((opt) => ({
						value: opt.value,
						optionLabel: opt.label,
					})),
				},
			]);
		}
	}, [aggregatorsData]);

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;
		let formattedValue = value;

		if (key === 'aggregatorId') {
			formattedValue =
				aggregatorsData?.aggregators?.find((row) => row?.id === value)?.name
					?.EN || '';
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
			searchInputPlaceHolder="Search by Provider"
			// hideCustomFilter
		/>
	);

	return {
		filterValidation: validation,
		selectedFiltersComponent,
		filterComponent,
	};
};

export default useFilters;
