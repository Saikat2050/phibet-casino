/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

import * as Yup from 'yup';

const getInitialValues = (defaultValue) => {
	let displayOption = null;

	if (defaultValue?.isSidebar) {
		displayOption = 'sidebar';
	} else if (defaultValue?.isLobbyPage) {
		displayOption = 'lobby';
	}

	return {
		isActive: defaultValue?.isActive || false,
		isSidebar: defaultValue?.isSidebar || false,
		isLobbyPage: defaultValue?.isLobbyPage || false,
		name: { EN: defaultValue?.name?.EN } || {},
		file: defaultValue?.iconUrl || '',
		slug: defaultValue?.slug || '',
		displayOption,
	};
};

const validateName = () => {
	const validationObject = {};
	// for (const file in langState) {
	// validationObject[file] = Yup.string()
	validationObject.EN = Yup.string()
		.required('Label Name is Required!')
		.min(3, 'Label Name must be at least 3 characters!')
		.max(15, 'Label Name cannot exceed 15 characters!')
		.nullable();
	// }
	return Yup.object(validationObject);
};

const validationSchema = (langState) =>
	Yup.object().shape({
		name: validateName(langState),
		slug: Yup.string().required('Slug Required').nullable(),
	});

const staticFormFields = [
	{
		name: 'slug',
		fieldType: 'textField',
		type: 'text',
		label: 'Slug',
		placeholder: 'Slug',
		isRequired: true,
	},
	{
		name: 'file',
		fieldType: 'file',
		label: 'Thumbnail',
		showThumbnail: true,
		isRequired: false,
	},
];

// Category filters
const staticFiltersFields = () => [
	{
		name: 'searchString',
		fieldType: 'textField',
		// type: 'search',
		label: '',
		placeholder: 'Search by category',
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
