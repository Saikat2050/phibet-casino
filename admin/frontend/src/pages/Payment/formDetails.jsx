import * as Yup from 'yup';
import { PAYMENT_PROVIDER_CATEGORY, PAYMENT_PROVIDERS } from './constants';
import { selectedLanguage } from '../../constants/config';

const { VITE_APP_API_URL } = import.meta.env;

// Filter
const staticFiltersFields = () => [
	{
		name: 'search',
		fieldType: 'textField',
		type: 'search',
		label: '',
		placeholder: 'Search by name',
	},
];

const filterValues = () => ({
	search: '',
});

const filterValidationSchema = () =>
	Yup.object({
		search: Yup.string().nullable(),
	});

const generaFromFields = (paymentDetails) => [
	{
		name: 'name',
		fieldType: 'textField',
		label: 'Provider Name',
		isRequired: true,
		// isDisabled: paymentDetails,
		placeholder: 'Provider Name',
		// optionList: PAYMENT_PROVIDERS.map(({ label, value }) => ({
		// 	optionLabel: label,
		// 	value,
		// })),
	},
	// {
	// 	name: 'aggregator',
	// 	fieldType: 'textField',
	// 	type: 'text',
	// 	label: 'Aggregator',
	// 	isRequired: true,
	// 	placeholder: 'Aggregator',
	// 	maximum: 51,
	// },
	{
		name: 'category',
		fieldType: 'select',
		label: 'Category',
		isRequired: true,
		placeholder: 'Category',
		optionList: PAYMENT_PROVIDER_CATEGORY.map(({ id, label, value }) => ({
			id,
			optionLabel: label,
			value,
		})),
	},
	// {
	// 	name: 'displayName',
	// 	fieldType: 'textField',
	// 	type: 'text',
	// 	label: 'Title',
	// 	isRequired: true,
	// 	placeholder: 'Title',
	// },
	// {
	// 	name: 'description',
	// 	fieldType: 'textField',
	// 	type: 'text',
	// 	label: 'Description',
	// 	isRequired: true,
	// 	placeholder: 'Description',
	// 	maximum: 201,
	// },
	// {
	// 	name: 'depositDescription',
	// 	fieldType: 'textField',
	// 	type: 'text',
	// 	label: 'Deposit Description',
	// 	isRequired: true,
	// 	placeholder: 'Description',
	// 	maximum: 201,
	// },
	// {
	// 	name: 'withdrawDescription',
	// 	fieldType: 'textField',
	// 	type: 'text',
	// 	label: 'Withdraw Description',
	// 	isRequired: true,
	// 	placeholder: 'Description',
	// 	maximum: 201,
	// },
	{
		name: 'depositAllowed',
		fieldType: 'toggle',
		label: 'Purchase Allowed',
		isNewRow: true,
		tooltipContent: 'If True Status is Purchase will be Active else Inactive',
	},
	{
		name: 'withdrawAllowed',
		fieldType: 'toggle',
		label: 'Redeem Allowed',
		isNewRow: false,
		tooltipContent: 'If True Status is Redeem will be Active else Inactive',
	},
	{
		name: 'depositKycRequired',
		fieldType: 'toggle',
		label: 'Purchase Kyc Required',
		// isNewRow: true,
		tooltipContent: 'If True Purchase Kyc Required',
	},
	{
		name: 'withdrawKycRequired',
		fieldType: 'toggle',
		label: 'Redeem Kyc Required',
		// isNewRow: true,
		tooltipContent: 'If True Redeem Kyc Required',
	},
	{
		name: 'depositPhoneRequired',
		fieldType: 'toggle',
		label: 'Purchase Phone Required',
		// isNewRow: true,
		tooltipContent: 'If True Purchase Phone Required',
	},
	{
		name: 'withdrawPhoneRequired',
		fieldType: 'toggle',
		label: 'Redeem Phone Required',
		// isNewRow: true,
		tooltipContent: 'If True Redeem Phone Required',
	},
	{
		name: 'depositProfileRequired',
		fieldType: 'toggle',
		label: 'Purchase Profile Required',
		// isNewRow: true,
		tooltipContent: 'If True Purchase Profile Required',
	},
	{
		name: 'withdrawProfileRequired',
		fieldType: 'toggle',
		label: 'Redeem Profile Required',
		// isNewRow: true,
		tooltipContent: 'If Redeem Profile Required',
	},
	// {
	// 	name: 'image',
	// 	fieldType: 'file',
	// 	type: '',
	// 	label: 'Payment Provider Image',
	// 	placeholder: 'Select payment provider image',
	// 	isNewRow: true,
	// 	showThumbnail: true,
	// },
	{
		name: 'depositDescription',
		fieldType: 'textEditor',
		type: '',
		label: 'Purchase Description',
		placeholder: 'Enter Purchase Description',
		isNewRow: true,
		fieldColOptions: { lg: 12 },
		defaultValue: paymentDetails?.depositDescription?.EN,
	},
	{
		name: 'withdrawDescription',
		fieldType: 'textEditor',
		type: '',
		label: 'Redeem Description',
		placeholder: 'Enter Redeem Description',
		isNewRow: true,
		fieldColOptions: { lg: 12 },
		defaultValue: paymentDetails?.withdrawDescription?.EN,
	},
	{
		name: 'depositImage',
		fieldType: 'file',
		type: '',
		label: 'Purchase Image',
		placeholder: 'Select purchase image',
		isNewRow: true,
		showThumbnail: true,
		isRequired: true,
	},
	{
		name: 'withdrawImage',
		fieldType: 'file',
		type: '',
		label: 'Redeem Image',
		placeholder: 'Select redeem image',
		isNewRow: false,
		showThumbnail: true,
		isRequired: true,
	},
];

const PaymentProviderStaticFormFields = (isDisabled) => [
	{
		name: 'name',
		fieldType: 'select',
		label: 'Provider Name',
		isRequired: true,
		isDisabled,
		placeholder: ' Select Provider Name',
		optionList: PAYMENT_PROVIDERS.map(({ label, value }) => ({
			optionLabel: label,
			value,
		})),
	},
	// {
	// 	name: 'Privatekey',
	// 	fieldType: 'textField',
	// 	type: 'text',
	// 	label: 'Private key',
	// 	// isRequired: true,
	// 	placeholder: 'Private key',
	// },
	// {
	// 	name: 'SecretKey',
	// 	fieldType: 'textField',
	// 	type: 'text',
	// 	label: 'Secret Key',
	// 	// isRequired: true,
	// 	placeholder: 'Secret Key',
	// },
	// {
	// 	name: 'MerchantId',
	// 	fieldType: 'textField',
	// 	type: 'text',
	// 	label: 'Merchant Id',
	// 	// isRequired: true,
	// 	placeholder: 'Merchant Id',
	// },
	{
		name: 'BaseURL',
		fieldType: 'textField',
		type: 'text',
		label: 'Base URL',
		// isRequired: true,
		placeholder: 'BaseURL',
		// isDisabled: true,
	},
	// {
	// 	name: 'isActive',
	// 	fieldType: 'switch',
	// 	label: 'Set Active/Inacative',
	// 	isNewRow: false,
	// },
	// {
	// 	name: 'icon',
	// 	fieldType: 'file',
	// 	type: '',
	// 	label: 'Payment Provider icon',
	// 	placeholder: 'Upload payment provider icon',
	// 	showThumbnail: true,
	// },
];

const getInitialNewConfigure = (defaultValue) => ({
	name: defaultValue?.name || null,
	icon: defaultValue?.icon || '',
	// Privatekey: defaultValue?.credentials?.Privatekey || '',
	// SecretKey: defaultValue?.credentials?.SecretKey || '',
	// MerchantId: defaultValue?.credentials?.MerchantId || '',
	BaseURL: defaultValue?.credentials?.BaseURL || VITE_APP_API_URL,
	isActive: defaultValue?.isActive || false,
});

const isRequired = (value) => {
	if (typeof value === 'string' && value?.length > 0) return true;
	// if (!value || !value.size) return false;
	return true;
};

const getInitialValues = (paymentDetails) => {
	// const providerLimit = {};
	const providerLimit = {
		4: {
			currencyId: 4,
			currencyName: 'Redeemable Sweeps Coins',
			maxWithdraw: paymentDetails?.maxWithdraw,
			minWithdraw: paymentDetails?.minWithdraw,
		},
	};
	if (paymentDetails?.providerLimits?.length)
		paymentDetails?.providerLimits?.forEach((item) => {
			providerLimit[parseFloat(item?.currencyId)] = {
				...item,
				currencyName: item?.currency?.name || '',
			};
		});

	return {
		name: paymentDetails?.name?.[selectedLanguage] || '',
		// displayName: paymentDetails?.displayName?.[selectedLanguage] || '',
		// description: paymentDetails?.description?.[selectedLanguage] || '',

		depositDescription:
			paymentDetails?.depositDescription?.[selectedLanguage] || '',
		withdrawDescription:
			paymentDetails?.withdrawDescription?.[selectedLanguage] || '',

		aggregator: paymentDetails?.aggregator || '',
		category: paymentDetails?.category || null,
		depositAllowed: paymentDetails?.depositAllowed
			? paymentDetails?.depositAllowed
			: false,
		withdrawAllowed: paymentDetails?.withdrawAllowed
			? paymentDetails?.withdrawAllowed
			: false,
		depositKycRequired: paymentDetails?.depositKycRequired
			? paymentDetails?.depositKycRequired
			: false,
		withdrawKycRequired: paymentDetails?.withdrawKycRequired
			? paymentDetails?.withdrawKycRequired
			: false,

		depositPhoneRequired: paymentDetails?.depositPhoneRequired
			? paymentDetails?.depositPhoneRequired
			: false,
		withdrawPhoneRequired: paymentDetails?.withdrawPhoneRequired
			? paymentDetails?.withdrawPhoneRequired
			: false,

		depositProfileRequired: paymentDetails?.depositProfileRequired
			? paymentDetails?.depositProfileRequired
			: false,
		withdrawProfileRequired: paymentDetails?.withdrawProfileRequired
			? paymentDetails?.withdrawProfileRequired
			: false,
		// image: paymentDetails?.image || '',
		// depositDescription: paymentDetails?.depositDescription ? paymentDetails?.depositDescription : '',
		depositImage: paymentDetails?.depositImage || null,
		withdrawImage: paymentDetails?.withdrawImage || null,
		providerLimit,
		blockedCountries: paymentDetails?.blockedCountries || [],
		// minWithdraw: paymentDetails?.minWithdraw || null,
		// maxWithdraw: paymentDetails?.maxWithdraw || null,
		currencyDetails: {
			currencyId: null,
			minDeposit: null,
			maxDeposit: null,
			minWithdraw: null,
			maxWithdraw: null,
		},
	};
};

const validationSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	icon: Yup.mixed()
		.required('icon is required')
		.test('required', 'Image Required', isRequired)
		// .imageDimensionCheck('Image Required', {
		// 	exactWidth: 442,
		// 	exactHeight: 240,
		// })
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

	depositImage: Yup.mixed()
		.required('Purchase image is required')
		.test('required', 'Image Required', isRequired)
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
		.required('Withdraw image is required')
		.test('required', 'Image Required', isRequired)
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
	// Privatekey: Yup.string().notRequired(),
	// SecretKey: Yup.string().notRequired(),
	// Merchantid: Yup.string().notRequired(),
	BaseURL: Yup.string()
		.matches(
			/^((https?):\/\/)?(www\.)?(([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[^\s]*)?(\?[^\s]*)?|((https?):\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/[^\s]*)?(\?[^\s]*)?$/,
			'Enter correct URL!'
		)
		.nullable(),
	isActive: Yup.boolean().notRequired(),
});

export {
	staticFiltersFields,
	filterValues,
	filterValidationSchema,
	generaFromFields,
	getInitialValues,
	getInitialNewConfigure,
	PaymentProviderStaticFormFields,
	validationSchema,
};
