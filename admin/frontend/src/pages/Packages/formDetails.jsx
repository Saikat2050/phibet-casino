import * as Yup from 'yup';
import { IS_ACTIVE_TYPES } from '../CasinoTransactionsList/constants';

const getInitialValues = (data) => ({
	amount: data?.amount || '',
	lable: data?.lable || '',
	gcCoin: data?.gcCoin || '',
	scCoin: data?.scCoin || '',
	isActive: data?.isActive || false,
	isVisibleInStore: data?.isVisibleInStore || false,
	validTill: data?.validTill || '',
	validFrom: data?.validFrom || '',
	customizationSettings: data?.customizationSettings || {
		color: 'blue',
		size: 'large',
	},
	maxPurchasePerUser: data?.maxPurchasePerUser || '',
	discountAmount: data?.discountAmount || '',
	discountEndDate: data?.discountEndDate ? new Date(data?.discountEndDate) : '',
	gcBonus: data?.gcBonus || '',
	scBonus: data?.scBonus || '',
	packagePurchaseNumber: data?.packagePurchaseNumber || '',
	timer: data?.timer || null,
	isFeatured: data?.isFeatured || false,
	welcomePackage: data?.welcomePackage || false,
	pricingTiers:
		data?.pricingTiers ||
		[
			// {
			// 	purchases: 100,
			// 	price: 44.99,
			// },
		],
	giftable: data?.giftable || false,
	// file: data?.imageUrl || '',
});

const staticFormFields = () => [
	{
		name: 'lable',
		fieldType: 'textField',
		type: 'text',
		label: 'Label',
		placeholder: 'Enter Label',
		isRequired: true,
	},
	{
		name: 'amount',
		fieldType: 'textField',
		type: 'number',
		label: 'Amount',
		placeholder: 'Enter Amount',
		isRequired: true,
	},
	{
		name: 'gcCoin',
		fieldType: 'textField',
		type: 'number',
		label: 'GC',
		placeholder: 'Enter GC Amount',
		isRequired: true,
	},
	{
		name: 'scCoin',
		fieldType: 'textField',
		type: 'number',
		label: 'SC',
		placeholder: 'Enter SC Amount',
		isRequired: true,
	},
	{
		name: 'maxPurchasePerUser',
		fieldType: 'textField',
		type: 'number',
		label: 'Maximum Purchase Per User',
		placeholder: 'Enter Maximum Purchase',
		isRequired: false,
	},
	{
		name: 'validTill',
		fieldType: 'dateRangeSelector',
		label: 'Valid Till',
		placeholder: 'Select Range',
		minDate: new Date(),
		maxDate: '',
		rangeKeys: ['validFrom', 'validTill'],
		isRequired: true,
	},
	{
		name: 'discountAmount',
		fieldType: 'textField',
		type: 'number',
		label: 'Discounted Amount',
		placeholder: 'Enter Discounted Amount',
		isRequired: false,
	},
	{
		name: 'discountEndDate',
		fieldType: 'dateTimePicker',
		isRequired: false,
		label: 'Discount End Date',
		placeholder: 'Select Discount End Date',
		mandatory: false,
		minDate: new Date(),
		maxDate: '',
		required: false,
	},
	{
		name: 'gcBonus',
		fieldType: 'textField',
		type: 'number',
		label: 'GC Bonus',
		placeholder: 'Enter GC Bonus Amount',
		isRequired: false,
	},
	{
		name: 'scBonus',
		fieldType: 'textField',
		type: 'number',
		label: 'SC Bonus',
		placeholder: 'Enter SC Bonus Amount',
		isRequired: false,
	},
	{
		name: 'packagePurchaseNumber',
		fieldType: 'textField',
		type: 'text',
		label: 'Package Purchase Number',
		placeholder: 'Enter Package Purchase Number',
		isRequired: false,
	},
	{
		name: 'timer',
		fieldType: 'timePicker',
		label: 'Timer',
		placeholder: 'Select Time',
		// minDate: new Date('00:00'),
		// maxDate: '',
		// rangeKeys: ['validFrom', 'validTill'],
		isRequired: true,
		dependsOn: 'welcomePackage',
		isHidable: (form) => !form.welcomePackage,
	},
	{
		name: 'isFeatured',
		fieldType: 'toggle',
		label: 'Featured',
		isNewRow: true,
		tooltipContent: 'Is Featured Package or not.',
		tooltipAlignment: 'left',
	},
	{
		name: 'welcomePackage',
		fieldType: 'toggle',
		label: 'Welcome Package',
		// isNewRow: true,
		tooltipContent: 'Is Welcome Package or not.',
		tooltipAlignment: 'left',
	},
	{
		name: 'isActive',
		fieldType: 'toggle',
		label: 'Is Active',
		tooltipContent: 'If True Status is Active else Inactive',
		tooltipAlignment: 'left',
	},
	{
		name: 'isVisibleInStore',
		fieldType: 'toggle',
		label: 'Visibility',
		tooltipAlignment: 'left',
		tooltipContent: 'Is Visible In Store',
	},
	// {
	// 	name: 'file',
	// 	fieldType: 'file',
	// 	type: '',
	// 	// isNewRow: true,
	// 	label: 'Image',
	// 	placeholder: 'Select image',
	// 	showThumbnail: true,
	// 	isRequired: true,
	// },
	// {
	// 	name: 'giftable',
	// 	fieldType: 'toggle',
	// 	label: 'Giftable',
	// 	tooltipAlignment: 'left',
	// },
];

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 50;
// const MAX_AMOUNT = 100000;
// const MAX_GC_COIN = 50000;
// const MAX_SC_COIN = 50000;
const MAX_PURCHASE_PER_USER = 1000;
const MAX_DISCOUNT_AMOUNT = 100;
// const MAX_GC_BONUS_COIN = 50000;
const MAX_SC_BONUS_COIN = 50000;

const packageFormSchema = () =>
	Yup.object({
		welcomePackage: Yup.bool(),
		lable: Yup.string()
			.min(
				MIN_TITLE_LENGTH,
				`Label must be at least ${MIN_TITLE_LENGTH} characters`
			)
			.max(
				MAX_TITLE_LENGTH,
				`Label must be at most ${MAX_TITLE_LENGTH} characters`
			)
			.required('Label is required'),
		// ranges: Yup.date()
		// 	.required('ranges required'),
		amount: Yup.number()
			.min(1, 'Amount should be greater than 1')
			// .max(MAX_AMOUNT, `Amount should be less than or equal to ${MAX_AMOUNT}`)
			.required('Amount fees required'),
		gcBonus: Yup.number().min(1, 'GC Bonus should be greater than 0'),
		// .max(
		// 	MAX_GC_BONUS_COIN,
		// 	`GC Bonus should be less than or equal to ${MAX_GC_BONUS_COIN}`
		// )
		scBonus: Yup.number().min(1, 'SC Bonus should be greater than 0'),
		// .max(
		// 	MAX_SC_BONUS_COIN,
		// 	`SC Bonus should be less than or equal to ${MAX_SC_BONUS_COIN}`
		// )
		packagePurchaseNumber: Yup.number()
			.min(1, 'Package Purchase Number should be greater than 1')
			.max(
				MAX_SC_BONUS_COIN,
				`Package Purchase Number should be less than or equal to ${MAX_SC_BONUS_COIN}`
			),
		timer: Yup.string()
			.when(['welcomePackage'], {
				is: (welcomePackage) => {
					if (welcomePackage) {
						return true;
					}
					return false;
				},
				then: (schema) => schema.required('Timer Required'),
			})
			.nullable(),
		gcCoin: Yup.number()
			.min(1, 'Gc Coin should be greater than 0')
			// .max(
			// 	MAX_GC_COIN,
			// 	`GC Coin should be less than or equal to ${MAX_GC_COIN}`
			// )
			.required('GC Coin fees required'),
		scCoin: Yup.number()
			.min(1, 'Sc Coin should be greater than 0')
			// .max(
			// 	MAX_SC_COIN,
			// 	`SC Coin should be less than or equal to ${MAX_SC_COIN}`
			// )
			.required('SC Coin fees required'),
		maxPurchasePerUser: Yup.number()
			.min(1, 'Max Purchase Per User should be greater than 1')
			.max(
				MAX_PURCHASE_PER_USER,
				`Max Purchase Per User should be less than or equal to ${MAX_PURCHASE_PER_USER}`
			),
		discountAmount: Yup.number()
			.min(1, 'Discount Amount should be greater than 1')
			.max(
				MAX_DISCOUNT_AMOUNT,
				`Discount Amount should be less than or equal to ${MAX_DISCOUNT_AMOUNT}`
			),
		discountEndDate: Yup.date()
			.nullable()
			.max(
				Yup.ref('validTill'),
				'Discount End Date cannot be greater than Package expiry date.'
			),
		// file: Yup.mixed()
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
		// 	.test('File Size', 'File Size Should be Less Than 1MB', (value) =>
		// 		typeof value === 'string'
		// 			? true
		// 			: !value || (value && value.size <= 1024 * 1024)
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
		// 	),
		validFrom: Yup.date().required('Valid Till is required'),
		validTill: Yup.date()
			.required('Valid Till is required')
			.min(
				Yup.ref('validFrom'),
				'Valid Till cannot be earlier than Valid From.'
			),
	});

// Staff Filter
const staticFiltersFields = () => [
	{
		name: 'isActive',
		fieldType: 'select',
		label: '',
		placeholder: 'Status',
		optionList: IS_ACTIVE_TYPES?.map(({ id, label, value }) => ({
			id,
			optionLabel: label,
			value,
		})),
	},
];

const filterValues = () => ({
	isActive: null,
	searchString: '',
	orderBy: '',
	order: '',
});

const filterValidationSchema = () =>
	Yup.object({
		isActive: Yup.string().nullable(),
		searchString: Yup.string().nullable(),
	});

export {
	staticFiltersFields,
	filterValues,
	filterValidationSchema,
	getInitialValues,
	staticFormFields,
	packageFormSchema,
};
