/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';

const maxLimit = 1000000;
const currencyValidate = () =>
	Yup.object().test('currency_limit_validate', (value) => {
		const currencySchema = {};
		for (const currencyId in value) {
			currencySchema[currencyId] = Yup.object().shape({
				currencyId: Yup.string().nullable(),
				minDeposit: Yup.number()
					.nullable()
					.min(0.1, 'Amount should be greater than 0')
					.max(maxLimit, `Amount should not exceed ${maxLimit}`)
					.when('maxDeposit', (items, schema) =>
						items?.[0] && items?.[0] !== null
							? schema.lessThan(
									Yup.ref('maxDeposit'),
									'Must be less than maximum purchase'
							  )
							: schema
					),
				maxDeposit: Yup.number()
					.nullable()
					.min(0.1, 'Amount should be greater than 0')
					.max(maxLimit, `Amount should not exceed ${maxLimit}`),
				minWithdraw: Yup.number()
					.transform((val, originalValue) => {
						if (
							originalValue === '' ||
							originalValue === null ||
							Number.isNaN(val)
						) {
							return undefined;
						}
						return val;
					})
					.nullable()
					.required("Redeem coins can't be empty")
					.min(0.1, 'Amount should be greater than 0')
					.max(maxLimit, `Amount should not exceed ${maxLimit}`)
					.when('maxWithdraw', (maxWithdraw, schema) =>
						maxWithdraw != null
							? schema.lessThan(
									Yup.ref('maxWithdraw'),
									'Must be less than maximum withdraw'
							  )
							: schema
					),

				maxWithdraw: Yup.number()
					.nullable()
					.min(0.1, 'Amount should be greater than 0')
					.max(maxLimit, `Amount should not exceed ${maxLimit}`),
			});
		}
		const validateSchema = Yup.object().shape(currencySchema);

		return validateSchema.validateSync(value, { context: this });
	});

const countriesValidate = () =>
	Yup.object({
		blockedCountries: Yup.string().required('Currency required'),
	});

const isRequired = (value) => {
	if (typeof value === 'string' && value?.length > 0) return true;
	if (!value || !value.size) return false;
	return true;
};

const generalFormSchema = () =>
	Yup.object({
		name: Yup.string().required('Provider Name Required'),
		// description: Yup.string()
		// 	.required('Description Required')
		// 	.max(200, 'Maximum 200 Characters Allowed')
		// 	.min(3, 'Minimum 3 Characters Required'),

		aggregator: Yup.string()
			.required('Payment Aggregator Required')
			.max(50, 'Maximum 50 Characters Allowed')
			.min(3, 'Minimum 3 Characters Required'),
		category: Yup.string().required('Payment Category Required'),
		// displayName: Yup.string().required('Title Required'),

		depositDescription: Yup.string()
			.required('Purchase Description Required')
			.max(200, 'Maximum 200 Characters Allowed')
			.min(3, 'Minimum 3 Characters Required'),

		withdrawDescription: Yup.string()
			.required('Redeem Description Required')
			.max(200, 'Maximum 200 Characters Allowed')
			.min(3, 'Minimum 3 Characters Required'),

		depositImage: Yup.mixed()
			.test('required', 'Purchase Image Required', isRequired)
			.nullable()
			.when(
				['$isFilePresent'],
				(isFilePresent, schema) =>
					isFilePresent?.[0] &&
					schema.test(
						'FILE_SIZE',
						'Please select any file.',
						(value) =>
							value && (typeof value === 'string' ? true : value.size > 0)
					)
			)
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

		withdrawImage: Yup.mixed()
			.test('required', 'Redeem Image Required', isRequired)
			.nullable()
			.when(
				['$isFilePresent'],
				(isFilePresent, schema) =>
					isFilePresent?.[0] &&
					schema.test(
						'FILE_SIZE',
						'Please select any file.',
						(value) =>
							value && (typeof value === 'string' ? true : value.size > 0)
					)
			)
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

export { currencyValidate, generalFormSchema, countriesValidate };
