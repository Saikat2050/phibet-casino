import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	getAggregatorsList,
	getCasinoCategoryDetailStart,
	getCasinoGamesStart,
	getCasinoProvidersDataStart,
} from '../../../store/actions';
import { itemsPerPage, selectedLanguage } from '../../../constants/config';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import { ACTIVE_KEY_MAP } from '../../../constants/common';

const keyMapping = {
	searchString: 'Search',
	isActive: 'Active',
	isFeatured: 'Is Featured',
	casinoProviderId: 'Provider',
	casinoCategoryId: 'Category',
	aggregatorId: 'Aggregator',
};

const useFilters = () => {
	const dispatch = useDispatch();

	const { casinoProvidersData, casinoCategoryDetails } = useSelector(
		(state) => state.CasinoManagementData
	);
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
			getCasinoGamesStart({
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

	// const handleAdvance = () => {
	// 	toggleAdvance();
	// };

	useEffect(() => {
		dispatch(getCasinoCategoryDetailStart());
		dispatch(getCasinoProvidersDataStart());
		dispatch(getAggregatorsList());
	}, []);

	useEffect(() => {
		// if (casinoProvidersData?.providers && casinoCategoryDetails?.categories) {
		const providerField = casinoProvidersData?.providers?.map((row) => ({
			optionLabel: row.name[selectedLanguage],
			value: row.id,
		}));

		const categoryField = casinoCategoryDetails?.categories?.map((row) => ({
			optionLabel: row.name[selectedLanguage],
			value: row.id,
		}));

		setFormFields([
			...staticFiltersFields(),
			{
				name: 'casinoProviderId',
				fieldType: 'select',
				label: '',
				placeholder: 'Provider',
				optionList: providerField,
			},
			{
				name: 'casinoCategoryId',
				fieldType: 'select',
				label: '',
				placeholder: 'Category',
				optionList: categoryField,
			},
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
		// }
	}, [casinoProvidersData, casinoCategoryDetails]);

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;
		let formattedValue = value;
		switch (key) {
			case 'isActive':
				formattedValue = ACTIVE_KEY_MAP[value] || value;
				break;
			case 'isFeatured':
				formattedValue = ACTIVE_KEY_MAP[value] || value;
				break;
			case 'casinoProviderId':
				formattedValue =
					casinoProvidersData?.providers?.find((row) => row?.id === value)
						?.name[selectedLanguage] || '';
				break;
			case 'casinoCategoryId':
				formattedValue =
					casinoCategoryDetails?.categories?.find((row) => row?.id === value)
						?.name[selectedLanguage] || '';
				break;
			case 'aggregatorId':
				formattedValue =
					aggregatorsData?.aggregators?.find((row) => row?.id === value)?.name
						?.EN || '';
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
			searchInputPlaceHolder="Search by name"
		/>
	);
	return {
		filterValidation: validation,
		selectedFiltersComponent,
		filterComponent,
	};
};

export default useFilters;
