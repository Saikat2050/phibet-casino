import * as Yup from 'yup';

const getInitialValues = () => ({
	message: '',
	files: [],
});

const validationSchema = () =>
	Yup.object().shape({
		message: Yup.string()
			.required('Message is required!')
			.min(3, 'At least 3 characters required!'),
		files: Yup.array()
			.of(
				Yup.mixed()
					.test('FILE_SIZE', 'File size should be less than 1MB', (value) =>
						typeof value === 'string'
							? true
							: !value || (value && value.size <= 1024 * 1024)
					)
					.test(
						'FILE_FORMAT',
						'Uploaded file has unsupported format.',
						(value) =>
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
			)
			.when(
				'$isFilePresent',
				(isFilePresent, schema) =>
					isFilePresent[0] &&
					schema.test(
						'FILE_REQUIRED',
						'Please select at least one file.',
						(value) => Array.isArray(value) && value.length > 0
					)
			),
	});

export { validationSchema, getInitialValues };
