/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as Yup from 'yup';
import { BONUS_TYPES } from '../constants';

const currencyValidate = () =>
	Yup.object().test('validate-bonus-currency', (formValues) => {
		const currencySchema = {};
		for (const [code] of Object.entries(formValues || {})) {
			currencySchema[code] = Yup.object().shape({
				amount: Yup.number()
					.min(0.01, 'Quantity should be greater than 0')
					.max(10000, 'Quantity should not exceed 10,000')
					.required('Quantity is required'),
			});
		}
		const validateSchema = Yup.object().shape(currencySchema);
		return validateSchema.validateSync(formValues, {
			context: this?.options?.context,
			abortEarly: false,
		});
	});

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 200;

// function loadImage(file) {
// 	return new Promise((resolve, reject) => {
// 		const img = new Image();
// 		img.onload = () => resolve({ width: img.width, height: img.height });
// 		img.onerror = reject;
// 		img.src = URL.createObjectURL(file);
// 	});
// }

const generalFormSchema = () =>
	Yup.object({
		promotionTitle: Yup.string()
			.min(
				MIN_TITLE_LENGTH,
				`Title must be at least ${MIN_TITLE_LENGTH} characters`
			)
			.max(
				MAX_TITLE_LENGTH,
				`Title must be at most ${MAX_TITLE_LENGTH} characters`
			)
			.required('Bonus Title is required'),
		bonusType: Yup.string().required('Bonus Type Required'),
		termAndCondition: Yup.string()
			.when(['bonusType'], {
				is: (bonusType) => {
					if (bonusType !== BONUS_TYPES.JOINING) {
						return true;
					}
					return false;
				},
				then: (schema) => schema.required('Terms and Conditions Required'),
			})
			.nullable(),

		description: Yup.string()
			.when(['bonusType'], {
				is: (bonusType) => {
					if (bonusType !== BONUS_TYPES.JOINING) {
						return true;
					}
					return false;
				},
				then: (schema) => schema.required('Description Required'),
			})
			.nullable(),

		quantity: Yup.number()
			.when(['bonusType'], {
				is: (bonusType) => {
					if (bonusType === BONUS_TYPES.FREESPINS) {
						return true;
					}
					return false;
				},
				then: (schema) =>
					schema
						.required('Quantity Required')
						.integer('Must be an integer')
						.min(0.01, 'Must be greater than 0')
						.max(100, 'Must be less than or equal to 100'),
			})
			.nullable(),

		// bonusImage: Yup.mixed()
		// 	.when(
		// 		'$isFilePresent',
		// 		(isFilePresent, schema) =>
		// 			isFilePresent &&
		// 			schema.test(
		// 				'FILE_SIZE',
		// 				'Please select any file.',
		// 				(value) =>
		// 					value && (typeof value === 'string' ? true : value.size > 0)
		// 			)
		// 	)
		// 	.test('File Size', 'File Size Should be Less Than 3MB', (value) =>
		// 		typeof value === 'string'
		// 			? true
		// 			: !value || (value && value.size <= 3 * 1024 * 1024)
		// 	)
		// 	.test('FILE_FORMAT', 'Uploaded file has unsupported format.', (value) =>
		// 		typeof value === 'string'
		// 			? true
		// 			: !value ||
		// 			  (value &&
		// 					[
		// 						'image/png',
		// 						'image/jpeg',
		// 						'image/jpg',
		// 						'image/webp',
		// 						'image/svg+xml',
		// 					].includes(value.type))
		// 	)
		// 	.test(
		// 		'ASPECT_RATIO',
		// 		'Image aspect ratio must be between 25:10 and 36:12. For example 300px by 100px image is accepted',
		// 		async (value) => {
		// 			if (typeof value === 'string' || !value) return true;
		// 			const image = await loadImage(value);
		// 			const aspectRatio = image.width / image.height;
		// 			return aspectRatio >= 25 / 10 && aspectRatio <= 36 / 12;
		// 		}
		// 	),

		validOnDays: Yup.array()
			.when('visibleInPromotions', {
				is: (visibleInPromotions) => {
					if (visibleInPromotions) {
						return true;
					}
					return false;
				},
				then: (schema) => schema.min(1, 'Select At Least One Day').nullable(),
			})
			.nullable(),

		percentage: Yup.number()
			.when(['bonusType'], {
				is: (bonusType) => {
					if (
						bonusType !== BONUS_TYPES.JOINING &&
						bonusType !== BONUS_TYPES.AMOE_CODE &&
						bonusType !== BONUS_TYPES.DAILY &&
						bonusType !== BONUS_TYPES.REFERRAL
					) {
						return true;
					}
					return false;
				},
				then: (schema) =>
					schema
						.required('Bonus percentage required')
						.min(1, 'Bonus percentage Must be greater than or equal to 1')
						.max(100, 'Bonus percentage must be less than or equal to 100'),
			})
			.nullable(),

		daysToClear: Yup.number()
			.when(['bonusType'], {
				is: (bonusType) => {
					if (
						bonusType !== BONUS_TYPES.JOINING &&
						bonusType !== BONUS_TYPES.AMOE_CODE
					) {
						return true;
					}
					return false;
				},
				then: (schema) =>
					schema
						.required('Days to clear required')
						.integer('Must be an integer')
						.min(0.01, 'Must be greater than 0')
						.max(365, 'Must be less than or equal to 365'),
			})
			.nullable(),
	});

export { currencyValidate, generalFormSchema };
