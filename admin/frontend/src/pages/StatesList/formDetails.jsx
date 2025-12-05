import * as Yup from 'yup';

// State filter
const filterValues = () => ({
	searchString: '',
});

const filterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
	});

export { filterValues, filterValidationSchema };
