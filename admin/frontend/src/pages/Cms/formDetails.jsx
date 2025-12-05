import * as Yup from 'yup';

// CMS Filter
const staticFiltersFields = () => [
	// {
	// 	name: 'searchString',
	// 	fieldType: 'textField',
	// 	type: 'search',
	// 	label: '',
	// 	placeholder: 'Search by title or Slug',
	// },
	{
		name: 'isActive',
		fieldType: 'select',
		label: '',
		placeholder: 'Status',
		optionList: [
			{
				id: 1,
				optionLabel: 'Active',
				value: true,
			},
			{
				id: 2,
				optionLabel: 'In Active',
				value: false,
			},
		],
	},
];

const filterValues = () => ({
	isActive: null,
	searchString: '',
});

const filterValidationSchema = () =>
	Yup.object({
		isActive: Yup.string().nullable(),
		searchString: Yup.string().nullable(),
	});

const getInitialValues = (cmsData) => ({
	content: cmsData?.content || {},
	isActive: cmsData ? !!cmsData?.isActive : true,
	language: 'EN',
	slug: cmsData ? cmsData?.slug : '',
	title: cmsData?.title || { EN: '' },
	category: cmsData?.category || ''
});

const createCmsNewSchema = () =>
	Yup.object().shape({
		content: Yup.object().shape({
			EN: Yup.string().required('Content is required'),
		}),
		slug: Yup.string()
			.required('Slug is required')
			.min(3, 'Slug must be at least 3 characters')
			.max(30, 'Slug must be at most 30 characters')
			.matches(/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/, 'Enter a valid URL slug'),

		title: Yup.object().shape({
			EN: Yup.string()
				.required('Provider Name Required')
				.max(100, 'Name must be less than 100 characters'),
		}),
	});

	export const PAGES_CATEGORY = [
		{ id: 'EXPLORE', label: 'Explore', value: 'explore' },
		{ id: 'HOW_TO', label: 'How To', value: 'how_to' },
		{ id: 'INFORMATION', label: 'Information', value: 'information' },
		{ id: 'ABOUNT_US', label: 'About Us', value: 'about_us' }
	];

const staticFormFields = (isView) => [
	{
		name: 'slug',
		label: 'Enter Slug',
		fieldType: 'textField',
		placeholder: 'Enter Slug',
		isDisabled: isView || false,
		fieldColOptions: { lg: 3 },
		containerClass: 'mt-4',
		isRequired: true,
	},
	{
		name: 'category',
		fieldType: 'select',
		label: 'Category',
		isRequired: true,
		placeholder: 'Category',
		fieldColOptions: {lg: 3 },
		optionList: PAGES_CATEGORY.map(({ id, label, value }) => ({
			id,
			optionLabel: label,
			value,
		})),
	},
	{
		name: 'isActive',
		fieldType: 'toggle',
		label: 'Status',
		placeholder: 'Status',
		isDisabled: isView || false,
		fieldColOptions: { xl: 2, lg: 2, md: 3 },
		switchSizeClass:
			'd-flex justify-content-between form-switch-md px-0 pt-2 mt-4',
	},
	// {
	// 	name: 'language',
	// 	fieldType: 'buttonGroup',
	// 	isDisabled: false,
	// 	labelClass: 'btn btn-primary mt-3 me-2 mx-0 px-3',
	// 	inputClassName: 'btn-check',
	// 	fieldColOptions: { xxl: 6, xl: 8, lg: 10, md: 12, sm: 12 },
	// 	optionList: languageOptions || [],
	// 	isNewRow: true,
	// },
];

export {
	staticFiltersFields,
	filterValues,
	filterValidationSchema,
	getInitialValues,
	createCmsNewSchema,
	staticFormFields,
};
