import * as Yup from 'yup';

// Filters
const staticFiltersFields = () => [
	// {
	// 	name: 'searchString',
	// 	fieldType: 'textField',
	// 	label: '',
	// 	placeholder: 'Search by template name',
	// },
];

const filterValues = () => ({
	searchString: '',
});

const createFilterValues = () => ({
	searchString: '',
	casinoProviderId: null,
});

const createFilterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
	});

const filterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
	});

const getInitialValues = (defaultValue) => ({
	name: defaultValue?.name || '',
	wageringMultiplier: defaultValue?.wageringMultiplier || '',
	wageringRequirementType: defaultValue?.wageringRequirementType || null,
	// searchString: '',
});

const createWageringTemplate = Yup.object().shape({
	name: Yup.string()
		.required('Template Name Required')
		.min(3, 'Minimum 3 Characters Required')
		.max(50, 'Maximum 50 Characters Allowed'),
	wageringMultiplier: Yup.number()
		.min(0.01, 'Wagering multiplier should be greater than 0')
		.max(100, 'Wagering multiplier should not exceed 100')
		.required('Wagering multiplier required'),
	wageringRequirementType: Yup.string().required('Wagering type required'),
	// searchString: Yup.string().nullable(),
});

const staticFormFields = [
	{
		name: 'name',
		fieldType: 'textField',
		label: 'Template Name',
		placeholder: 'Enter name',
		maximum: 51,
		isRequired: true,
	},
	{
		name: 'wageringRequirementType',
		fieldType: 'select',
		label: 'Select wagering type',
		isRequired: true,
		placeholder: 'Select wagering type',
		optionList: [
			{
				id: 1,
				optionLabel: 'Bonus',
				value: 'bonus',
			},
			{
				id: 2,
				optionLabel: 'Bonus Plus Cash',
				value: 'bonus_plus_cash',
			},
		],
	},
	{
		name: 'wageringMultiplier',
		fieldType: 'textField',
		label: 'Wagering Multiplier',
		placeholder: 'Wagering Multiplier',
		type: 'number',
		isRequired: true,
	},
];

export {
	filterValues,
	filterValidationSchema,
	getInitialValues,
	createWageringTemplate,
	staticFormFields,
	createFilterValidationSchema,
	createFilterValues,
	staticFiltersFields,
};
