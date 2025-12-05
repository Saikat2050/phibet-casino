import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
} from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import {
	getCasinoProvidersDataStart,
	getWageringTemplateDetails,
} from '../../../store/actions';
import { itemsPerPage, selectedLanguage } from '../../../constants/config';
import SelectedFilters from '../../../components/Common/SelectedFilters';
import CustomFilters from '../../../components/Common/CustomFilters';

const keyMapping = {
	searchString: 'Search',
	casinoProviderId: 'Casino Providers',
};

const useCreateFilters = () => {
	const dispatch = useDispatch();
	const { casinoProvidersData } = useSelector(
		(state) => state.CasinoManagementData
	);

	const fetchData = (values) => {
		dispatch(
			getWageringTemplateDetails({
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
		if (!casinoProvidersData?.providers) {
			dispatch(getCasinoProvidersDataStart());
		}
	}, []);

	useEffect(() => {
		const providerField = casinoProvidersData?.providers?.map((row) => ({
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
		]);
	}, [casinoProvidersData]);

	const filterFormatter = (key, value) => {
		const formattedKey = keyMapping[key] || key;
		let formattedValue = value;
		switch (key) {
			case 'casinoProviderId':
				formattedValue =
					casinoProvidersData?.providers?.find((row) => row?.id === value)
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
			searchInputPlaceHolder="Search by template name"
		/>
	);

	return {
		filterFields: formFields,
		filterValidation: validation,
		casinoProvidersData,
		filterComponent,
		selectedFiltersComponent,
	};
};

export default useCreateFilters;
