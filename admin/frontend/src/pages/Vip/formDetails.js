import * as Yup from 'yup';

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 50000;
// const MAX_AMOUNT = 100000;
// const MAX_GC_COIN = 50000;
// const MAX_SC_COIN = 50000;
// const MAX_PURCHASE_PER_USER = 1000;
// const MAX_DISCOUNT_AMOUNT = 100;

const vipTierSchema = () =>
	Yup.object({
		level: Yup.number()
			.min(0, 'Level required')
			.max(1000, `Level should be less than or equal to ${1000}`)
			.required('Level required'),
		// xpRequirement: Yup.number()
		// 	.min(1, `Amount should be more than 0`)
		// 	.max(
		// 		MAX_TITLE_LENGTH,
		// 		`XP must be at most ${MAX_TITLE_LENGTH} characters`
		// 	)
		// 	.required('XP Requirement is required'),
		xpRequirement: Yup.number()
			.when('level', {
				is: 0,
				then: () =>
					Yup.number().test(
						'is-zero',
						'Must be 0 for Level 0',
						(value) => value === 0
					),
				otherwise: () =>
					Yup.number()
						.min(1, `Amount should be more than 0`)
						.max(
							MAX_TITLE_LENGTH,
							`XP must be at most ${MAX_TITLE_LENGTH} characters`
						),
			})
			.required('XP Requirement is required'),
		name: Yup.string()
			.min(
				MIN_TITLE_LENGTH,
				`Name must be at least ${MIN_TITLE_LENGTH} characters`
			)
			.max(
				MAX_TITLE_LENGTH,
				`Name must be at most ${MAX_TITLE_LENGTH} characters`
			)
			.required('Name is required'),
		tierUpBonusGc: Yup.number()
			.min(1, 'TierUpBonusGc should be greater than 0')
			// .max(
			// 	MAX_GC_COIN,
			// 	`Amount should be greater than or equal to ${MAX_GC_COIN}`
			// )
			.required('Tier Up Bonus Gc fees required'),
		tierUpBonusSc: Yup.number()
			.min(1, 'TierUpBonusSc should be greater than 0')
			// .max(
			// 	MAX_SC_COIN,
			// 	`Amount should be greater than or equal to ${MAX_SC_COIN}`
			// )
			.required('Tier Up Bonus Sc fees required'),
		monthlyPercentage: Yup.number()
			.min(0, 'Percentage should be greater than or equal to 0')
			.max(100, 'Percentage should be less than or equal to 100')
			.required('Monthly Percentage is required'),
		weeklyPercentage: Yup.number()
			.min(0, 'Percentage should be greater than or equal to 0')
			.max(100, 'Percentage should be less than or equal to 100')
			.required('Weekly Percentage is required'),
		// rakebackPercentage: Yup.number()
		// 	.min(0, 'Percentage should be greater than or equal to 0')
		// 	.max(100, 'Percentage should be less than or equal to 100')
		// 	.required('Weekly Percentage is required'),
		// issueSpinWheel: Yup.number()
		// 	.min(0, 'Issue Spin Wheel  should be greater than or equal to 0')
		// 	.max(100, 'Issue Spin Wheel should be less than or equal to 100')
		// 	.required('Issue Spin Wheel is required'),
		isActive: Yup.boolean(),
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
	});

const vipTierInitialValues = (details) => ({
	gc: details?.tierUpBonus?.gc ?? 0,
	sc: details?.tierUpBonus?.sc ?? 0,
	status: details?.isActive ?? false,
});

// Staff Filter
// const staticFiltersFields = () => [
// 	{
// 		name: 'isActive',
// 		fieldType: 'select',
// 		label: '',
// 		placeholder: 'Status',
// 		optionList: IS_ACTIVE_TYPES?.map(({ id, label, value }) => ({
// 			id,
// 			optionLabel: label,
// 			value,
// 		})),
// 	},
// ];

// const filterValues = () => ({
// 	isActive: null,
// 	searchString: '',
// 	orderBy: '',
// 	order: '',
// });

// const filterValidationSchema = () =>
// 	Yup.object({
// 		isActive: Yup.string().nullable(),
// 		searchString: Yup.string().nullable(),
// 	});

const getInitialValues = (data) => ({
	level: data?.level,
	name: data?.name || '',
	// xpRequirement: data?.xpRequirement,
	xpRequirement: data?.level === 0 ? 0 : data?.xpRequirement,
	monthlyPercentage: data?.monthlyPercentage,
	weeklyPercentage: data?.weeklyPercentage,
	rakebackPercentage: data?.rakebackPercentage ?? 0,
	// issueSpinWheel: data?.issueSpinWheel,
	isActive: data?.isActive || false, // Default to false
	tierUpBonusGc: data?.tierUpBonusGc,
	tierUpBonusSc: data?.tierUpBonusSc,
	// file: data?.icon || '',
});

const staticFormFields = () => [
	{
		name: 'level',
		fieldType: 'textField',
		label: 'Level',
		type: 'text',
		placeholder: 'Enter Level',
		isRequired: true,
	},
	{
		name: 'name',
		fieldType: 'textField',
		label: 'Name',
		type: 'text',
		placeholder: 'Enter Name',
		isRequired: true,
	},
	{
		name: 'xpRequirement',
		fieldType: 'textField',
		label: 'XP Requirement',
		type: 'number',
		placeholder: 'Enter SC quantity player get on tier',
		isRequired: true,
		disabled: (values) => values.level === 0,
	},
	{
		name: 'monthlyPercentage',
		fieldType: 'textField',
		label: 'Monthly Percentage',
		type: 'text',
		placeholder: 'Enter Monthly Percentage',
		isRequired: true,
	},
	{
		name: 'weeklyPercentage',
		fieldType: 'textField',
		label: 'Weekly Percentage',
		type: 'text',
		placeholder: 'Enter Weekly Percentage',
		isRequired: true,
	},
	// {
	// 	name: 'rakebackPercentage',
	// 	fieldType: 'textField',
	// 	label: 'RakeBack Percentage',
	// 	type: 'text',
	// 	placeholder: 'Enter RakeBack Percentage',
	// 	isRequired: true,
	// },
	// {
	// 	name: 'issueSpinWheel',
	// 	fieldType: 'textField',
	// 	label: 'Issue Spin Wheel',
	// 	type: 'text',
	// 	placeholder: 'Enter Issue Spin Wheel',
	// 	isRequired: true,
	// },
	{
		name: 'tierUpBonusGc',
		fieldType: 'textField',
		label: 'Tier Up Bonus GC',
		type: 'text',
		placeholder: 'Tier Up Bonus GC',
		isRequired: true,
	},
	{
		name: 'tierUpBonusSc',
		fieldType: 'textField',
		label: 'Tier Up Bonus SC',
		type: 'text',
		placeholder: 'Tier Up Bonus SC',
		isRequired: true,
	},
	// {
	// 	name: 'file',
	// 	fieldType: 'file',
	// 	type: '',
	// 	label: 'Image',
	// 	placeholder: 'Select image',
	// 	showThumbnail: true,
	// 	isRequired: true,
	// },
	{
		name: 'isActive',
		fieldType: 'toggle',
		label: 'Status',
		placeholder: 'Status',
		// isDisabled: isView || false,
		fieldColOptions: { xl: 2, lg: 2, md: 3 },
		switchSizeClass:
			'd-flex justify-content-between form-switch-md px-0 pt-2 mt-4',
	},
];

export {
	vipTierSchema,
	vipTierInitialValues,
	staticFormFields,
	getInitialValues,
};
