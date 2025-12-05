import * as Yup from 'yup';

// Language filter

const filterValues = () => ({
	searchString: '',
});

const filterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
	});

export { filterValues, filterValidationSchema };
