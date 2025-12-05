/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import * as Yup from 'yup';

const getInitialValues = (defaultValue) => ({
	slug: defaultValue?.slug,
	title: defaultValue?.title,
	description: defaultValue?.description,
	canonicalUrl: defaultValue?.canonicalUrl,
	noIndex: defaultValue?.noIndex || false,
});

const validationSchema = () =>
	Yup.object().shape({
		slug: Yup.string()
			.test('SLUG VALIDATION', 'Route must start with slash (/)', (value) =>
				value.startsWith('/')
			)
			.test(
				'HTTP AND HTTPS CHECK',
				'Please enter a valid relative route',
				(value) => {
					if (
						value?.toLowerCase()?.startsWith('http') ||
						value?.toLowerCase()?.startsWith('https')
					) {
						return false;
					}
					return true;
				}
			)
			.test('BLANK SPACES', 'Blank spaces are not allowed', (value) => {
				if (value?.includes(' ')) {
					return false;
				}
				return true;
			})
			.test('CAPITAL LETTERS', 'Capital letters are not allowed', (value) => {
				if (value?.trim()?.toLowerCase() !== value?.trim()) {
					return false;
				}
				return true;
			})
			.required('Route Required')
			.nullable(),
		title: Yup.string()
			.required('Title Required')
			.test('TITLE VALIDATION', 'Enter a valid title', (value) => value?.trim())
			.nullable(),
		description: Yup.string()
			.required('Description Required')
			.test('DESCRIPTION VALIDATION', 'Enter a valid Description', (value) =>
				value?.trim()
			)
			.nullable(),
		canonicalUrl: Yup.string()
			.test(
				'CANONICAL URL VALIDATION',
				'Route must start with slash (/)',
				(value) => {
					if (value?.trim()) {
						return value?.trim()?.startsWith('/');
					}
					return true;
				}
			)
			.test('BLANK SPACES', 'Blank spaces are not allowed', (value) => {
				if (value?.includes(' ')) {
					return false;
				}
				return true;
			})
			.test('CAPITAL LETTERS', 'Capital letters are not allowed', (value) => {
				if (value?.trim()?.toLowerCase() !== value?.trim()) {
					return false;
				}
				return true;
			})
			.nullable(),
	});

const staticFormFields = [
	{
		name: 'slug',
		fieldType: 'textField',
		label: 'Slug',
	},
	{
		name: 'title',
		fieldType: 'textField',
		label: 'Meta Title',
	},
	{
		name: 'description',
		fieldType: 'textField',
		label: 'Meta Description',
	},
	{
		name: 'canonicalUrl',
		fieldType: 'textField',
		label: 'Canonical Url',
	},
	{
		name: 'noIndex',
		fieldType: 'switch',
		label: 'No Index',
	},
];

// Category filters
const staticFiltersFields = () => [
	{
		name: 'searchString',
		fieldType: 'textField',
		label: '',
		placeholder: 'Search by Slug',
	},
];

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
	staticFiltersFields,
	filterValues,
	filterValidationSchema,
};
