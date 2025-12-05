/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import * as Yup from 'yup';
import { CASINO_PROVIDERS } from './constants';

const getInitialValues = (defaultValue) => ({
	language: 'EN',
	name: defaultValue?.name?.EN || null,
	providerId: defaultValue?.id || null,
	file: defaultValue?.iconUrl || '',
});

const checkImageDimensions = (file, width, height) =>
	new Promise((resolve) => {
		if (typeof file === 'string') {
			resolve(true);
			return;
		}

		if (!file) {
			resolve(true);
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (event) => {
			const img = new Image();
			img.src = event.target.result;
			img.onload = () => {
				const imgWidth = img.width;
				const imgHeight = img.height;
				resolve(imgWidth === width && imgHeight === height);
			};
		};
	});

// const validateName = (name) => {
// 	const validationObject = {};
// 	for (const file in name) {
// 		validationObject[file] = Yup.string()
// 			.required('Label Name Required!')
// 			.nullable();
// 	}
// 	return Yup.object(validationObject);
// };

const validationSchema = () =>
	Yup.object().shape({
		name: Yup.string()
			// .min(3, 'Minimum 3 Characters Required')
			// .max(50, 'Maximum 50 Characters Allowed')
			.required('Provider Name Required'),
		file: Yup.mixed()
			.test('File Size', 'File Size Should be Less Than 1MB', (value) =>
				typeof value === 'string'
					? true
					: !value || (value && value.size <= 1024 * 1024)
			)
			.when(
				'$isFilePresent',
				(isFilePresent, schema) =>
					isFilePresent[0] &&
					schema.test(
						'FILE_SIZE',
						'Please select any file.',
						(value) =>
							value && (typeof value === 'string' ? true : value.size > 0)
					)
			)
			.test('FILE_FORMAT', 'Uploaded file has unsupported format.', (value) =>
				typeof value === 'string'
					? true
					: !value ||
					  (value &&
							[
								'image/png',
								'image/jpeg',
								'image/jpg',
								'image/webp',
								'image/svg+xml',
							].includes(value.type))
			)
			.test(
				'IMAGE_DIMENSIONS',
				'Image dimensions must be exactly 180x95 pixels',
				(value) => checkImageDimensions(value, 180, 95)
			),
	});
const staticFormFields = (isEdit) => [
	{
		name: 'name',
		fieldType: isEdit ? 'textField' : 'select',
		label: 'Provider Name',
		isRequired: true,
		isDisabled: isEdit,
		placeholder: ' Select Provider Name',
		optionList: CASINO_PROVIDERS.map(({ label, value }) => ({
			optionLabel: label,
			value,
		})),
	},
	{
		name: 'file',
		fieldType: 'file',
		label: 'Thumbnail',
		placeholder: 'Enter Thumbnail ',
		showThumbnail: true,
		helperText: 'Image dimensions must be exactly 180x95 pixels',
	},
];

// Provider filter
const staticFiltersFields = () => [
	// {
	// 	name: 'searchString',
	// 	fieldType: 'textField',
	// 	label: '',
	// 	placeholder: 'Search by provider',
	// },
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
