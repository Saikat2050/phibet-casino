import * as Yup from 'yup';

const getInitialValues = (defaultValue) => ({
	name: defaultValue?.name || '',
	isActive: defaultValue?.isActive || false,
});

const validationSchema = Yup.object({
	name: Yup.string()
		.max(50, 'Name must be less than 50 characters')
		.matches(/^[A-Za-z0-9 ]+$/, 'Only Alpha-Numeric values Allowed')
		.required('Aggregator Name Required'),
});

const staticFormFields = [
	{
		name: 'name',
		fieldType: 'textField',
		label: 'Aggregator Name',
		placeholder: 'Enter Aggregator Name',
	},
	{
		name: 'isActive',
		fieldType: 'switch',
		label: 'Active',
	},
];

export { validationSchema, getInitialValues, staticFormFields };
