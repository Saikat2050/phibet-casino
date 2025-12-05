import * as Yup from 'yup';

const getInitialValues = (defaultValue) => ({
	countryName: defaultValue?.countryName || '',
	languageId: defaultValue?.languageId || null,
});

const validationSchema = Yup.object().shape({
	countryName: Yup.string().required('Language cannot be Empty'),
});

const staticFormFields = [
	{
		name: 'countryName',
		fieldType: 'textField',
		label: 'Country Name',
		isDisabled: true,
		isRequired: true,
	},
];

// Country filter

const filterValues = () => ({
	searchString: '',
});

const filterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
	});

export {
	validationSchema,
	getInitialValues,
	staticFormFields,
	filterValues,
	filterValidationSchema,
};
