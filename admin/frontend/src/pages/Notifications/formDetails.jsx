import * as Yup from 'yup';

const getInitialNotifyData = (defaultValue) => ({
	language: 'EN', // FE use
	choosePlayers: false, // FE use

	title: defaultValue?.title || { EN: '' },
	description: defaultValue?.description || { EN: '' },
	file: defaultValue?.image || '',
	url: defaultValue?.url || '',
	userIds: defaultValue?.userIds || [],
});

const validatedNotify = () =>
	Yup.object().shape({
		title: Yup.object().shape({
			EN: Yup.string()
				.required('Title in English is required.')
				.max(50, 'Title must be less than 50 characters.'),
		}),
		description: Yup.object().shape({
			EN: Yup.string()
				.required('Description in English is required.')
				.max(200, 'Description must be less than 200 characters.'),
		}),
		url: Yup.string()
			.matches(
				/^((https?):\/\/)?(www\.)?(([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[^\s]*)?(\?[^\s]*)?|((https?):\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/[^\s]*)?(\?[^\s]*)?$/,
				'Enter correct URL!'
			)
			.nullable(),
		file: Yup.mixed()
			.nullable()
			.test('File Size', 'File Size Should be Less Than 1MB', (value) =>
				typeof value === 'string'
					? true
					: !value || (value && value.size <= 1024 * 1024)
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
			),
	});

export { getInitialNotifyData, validatedNotify };
