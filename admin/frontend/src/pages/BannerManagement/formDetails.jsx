import * as Yup from 'yup';

const getInitialValues = (defaultValue) => ({
	bannerId: defaultValue?.bannerId || '',
	desktopImage: '',
	mobileImage: '',
});

const staticFormFields = [
	{
		name: 'desktopImage',
		fieldType: 'file',
		label: 'Desktop Banner Image',
		showThumbnail: true,
	},
	{
		name: 'mobileImage',
		fieldType: 'file',
		label: 'Mobile Banner Image',
		showThumbnail: true,
	},
];

function loadImage(file) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve({ width: img.width, height: img.height });
		img.onerror = reject;
		img.src = URL.createObjectURL(file);
	});
}

const validationSchema = () =>
	Yup.object({
		desktopImage: Yup.mixed()
			.nullable()
			// .when(
			//  '$isFilePresent',
			//  (isFilePresent, schema) =>
			//      isFilePresent &&
			//      schema.test(
			//          'FILE_SIZE',
			//          'Please select any file.',
			//          (value) =>
			//              value && (typeof value === 'string' ? true : value.size > 0)
			//      )
			// )
			.test('File Size', 'File Size Should be Less Than 3MB', (value) =>
				typeof value === 'string'
					? true
					: !value || (value && value.size <= 3 * 1024 * 1024)
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
				'dimensions',
				'Desktop image must be between 1100x300 and 2000x450',
				async (value) => {
					if (typeof value === 'string' || !value) return true; // Skip if no file is selected

					try {
						const { width, height } = await loadImage(value);
						return (
							width >= 1100 && width <= 2000 && height >= 300 && height <= 450
						);
					} catch (error) {
						return false;
					}
				}
			),

		mobileImage: Yup.mixed()
			.nullable()
			// .when(
			//  '$isFilePresent',
			//  (isFilePresent, schema) =>
			//      isFilePresent &&
			//      schema.test(
			//          'FILE_SIZE',
			//          'Please select any file.',
			//          (value) =>
			//              value && (typeof value === 'string' ? true : value.size > 0)
			//      )
			// )
			.test('File Size', 'File Size Should be Less Than 3MB', (value) =>
				typeof value === 'string'
					? true
					: !value || (value && value.size <= 3 * 1024 * 1024)
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
				'dimensions',
				'Mobile image must be between 280x80 and 400x230',
				async (value) => {
					if (typeof value === 'string' || !value) return true; // Skip if no file is selected

					try {
						const { width, height } = await loadImage(value);
						return (
							width >= 280 && width <= 400 && height >= 80 && height <= 230
						);
					} catch (error) {
						return false;
					}
				}
			),
	});

export { getInitialValues, staticFormFields, validationSchema };
