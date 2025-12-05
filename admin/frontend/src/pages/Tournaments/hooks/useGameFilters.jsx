import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	gameFilterValidationSchema,
	gameFilterValues,
	staticGameFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { itemsPerPage, selectedLanguage } from '../../../constants/config';
import {
	getCasinoCategoryDetailStart,
	getCasinoGamesStart,
	getCasinoProvidersDataStart,
} from '../../../store/actions';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';
import { ACTIVE_KEY_MAP } from '../../../constants/common';

const keyMapping = {
	isActive: 'Active',
	searchString: 'Search',
	casinoCategoryId: 'Category',
	casinoProviderId: 'Provider',
	isFeatured: 'Is Featured',
};

const useGameFilters = () => {
	const dispatch = useDispatch();
	const { casinoProvidersData, casinoCategoryDetails } = useSelector(
		(state) => state.CasinoManagementData
	);

	const fetchData = (values) => {
		dispatch(
			getCasinoGamesStart({
				page: 1,
				pageNo: itemsPerPage,
				...values,
			})
		);
	};

	const handleFilter = (values) => {
		fetchData(values);
	};

	const { validation, formFields, setFormFields } = useForm({
		initialValues: gameFilterValues(),
		validationSchema: gameFilterValidationSchema(),
		// onSubmitEntry: handleFilter,
		staticFormFields: staticGameFiltersFields(),
	});

	useEffect(() => {
		if (!casinoCategoryDetails?.categories) {
			dispatch(getCasinoCategoryDetailStart());
		}

		if (!casinoProvidersData?.providers) {
			dispatch(getCasinoProvidersDataStart());
		}
	}, []);

	useEffect(() => {
		if (casinoProvidersData?.providers && casinoCategoryDetails?.categories) {
			const providerField = casinoProvidersData?.providers?.map((row) => ({
				optionLabel: row.name[selectedLanguage],
				value: row.id,
			}));

			const categoryField = casinoCategoryDetails?.categories?.map((row) => ({
				optionLabel: row.name[selectedLanguage],
				value: row.id,
			}));

			setFormFields([
				...staticGameFiltersFields(),
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
			]);
		}
	}, [casinoProvidersData]);

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;

		let formattedValue = value;

		switch (key) {
			case 'isFeatured':
			case 'isActive':
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
			searchInputPlaceHolder="Search by game name"
		/>
	);

	return {
		filterFields: formFields,
		filterValidation: validation,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useGameFilters;
