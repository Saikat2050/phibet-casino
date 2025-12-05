import * as Yup from 'yup';

// States Filter
const staticFiltersFields = () => [
	{
		name: 'searchString',
		fieldType: 'textField',
		// type: 'search',
		label: '',
		placeholder: 'Search States',
	},
];

const filterValues = () => ({
	searchString: '',
});

const filterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
	});

export { filterValidationSchema, staticFiltersFields, filterValues };
