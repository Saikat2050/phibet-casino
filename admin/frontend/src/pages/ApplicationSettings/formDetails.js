import * as Yup from 'yup';

const BOOL = {
	true: 'true',
	false: 'false',
};

const getSiteConfigInitialValues = (details) => ({
	userEndUrl: details?.userEndUrl?.value || '',
	applicationName: details?.applicationName?.value || '',
	adminEndUrl: details?.adminEndUrl?.value || '',
	defaultSupport: details?.defaultSupport?.value || '',
	legalSupport: details?.legalSupport?.value || '',
	partnersSupport: details?.partnersSupport?.value || '',
	logo: details?.logo?.value || '',
	maxOdds: details?.maxOdds?.value || '',
	minOdds: details?.minOdds?.value || '',
	exchangeBetCommission: details?.exchangeBetCommission?.value || '',
	minStakeAmount: details?.minStakeAmount?.value || '',
	gallery: details?.gallery?.value || '',
	siteLayout: details?.siteLayout?.value || '',
	xpRequirements: details?.xpRequirements?.value || '',
	footerLandingPage: details?.footerLandingPage?.value || '',
	footerLobbyPage: details?.footerLobbyPage?.value || '',
	purchaseCooldown: details?.purchaseCooldown?.value || '',
});

const getAppSettingInitialValues = (details) => ({
	allowBetting: details?.allowBetting?.value === BOOL.true || false,
	casino: details?.casino?.value === BOOL.true || false,
	sportsbook: details?.sportsbook?.value === BOOL.true || false,
	maintenance: details?.maintenance?.value === BOOL.true || false,
	legalSupport: details?.legalSupport?.value || '',
	partnersSupport: details?.partnersSupport?.value || '',
	depositKycRequired: details?.depositKycRequired?.value === BOOL.true || false,
	depositPhoneRequired:
		details?.depositPhoneRequired?.value === BOOL.true || false,
	depositProfileRequired:
		details?.depositProfileRequired?.value === BOOL.true || false,
	withdrawKycRequired:
		details?.withdrawKycRequired?.value === BOOL.true || false,
	withdrawProfileRequired:
		details?.withdrawProfileRequired?.value === BOOL.true || false,
	gamePlayeKycRequired:
		details?.gamePlayeKycRequired?.value === BOOL.true || false,
	withdrawPhoneRequired:
		details?.withdrawPhoneRequired?.value === BOOL.true || false,
});

const adminSiteConfigSchema = Yup.object().shape({
	applicationName: Yup.string()
		.min(3, 'Name must be atleast 3 characters')
		.max(200)
		.matches(/^[A-Za-z\s]+$/, 'Application Name can only contain letters')
		.required('Name Required'),
	userEndUrl: Yup.string()
		.matches(
			/((https?):\/\/)?(www\.)?(([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[^\s]*)?(\?[^\s]*)?|((https?):\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/[^\s]*)?(\?[^\s]*)?/,
			'Enter correct url!'
		)
		.required('Url Required'),
	adminEndUrl: Yup.string().matches(
		/((https?):\/\/)?(www\.)?(([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[^\s]*)?(\?[^\s]*)?|((https?):\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/[^\s]*)?(\?[^\s]*)?/,
		'Enter correct url!'
	),
	defaultSupport: Yup.string()
		.email('Invalid Email')
		.max(50)
		.required('Email Required'),
	logo: Yup.mixed()
		.test('File Size', 'File Size Should be Less Than 1MB', (value) =>
			typeof value === 'string'
				? true
				: !value || (value && value.size <= 1024 * 1024)
		)
		.test('FILE_FORMAT', 'Uploaded file has unsupported format.', (value) =>
			typeof value === 'string'
				? true
				: value && ['image/png', 'image/jpeg', 'image/svg'].includes(value.type)
		),
	// maxOdds: Yup.number(),
	// minOdds: Yup.number(),
	legalSupport: Yup.string()
		.email('Invalid Email')
		.max(50)
		.required('Email Required'),
	partnersSupport: Yup.string()
		.email('Invalid Email')
		.max(50)
		.required('Email Required'),
	minStakeAmount: Yup.number(),
	exchangeBetCommission: Yup.number(),
	xpRequirements: Yup.number().required('VIP XP Requirement Required'),
	footerLandingPage: Yup.string()
		// .matches(/^[A-Za-z\s]+$/, 'Application Name can only contain letters')
		.required('Landing Page Footer Description Required'),
	footerLobbyPage: Yup.string()
		// .matches(/^[A-Za-z\s]+$/, 'Application Name can only contain letters')
		.required('Lobby Page Footer Description Required'),
	purchaseCooldown: Yup.number().required('Purchase Cooldown Time Required'),

});

const appSettingValidation = Yup.object().shape({});

const leftStaticSiteConfigFormFields = (
	details,
	customBlurHandler,
	disabled = false
) => [
	{
		name: 'applicationName',
		fieldType: 'textField',
		description:
			details?.applicationName?.description || 'Name of the application',
		label: 'Application name',
		placeholder: 'Enter application name',
		customBlurHandler,
		isHidable: true,
		isDisabled: disabled,
	},
	{
		name: 'partnersSupport',
		fieldType: 'textField',
		description: details?.partnersSupport?.description,
		label: 'Partners email',
		placeholder: 'Enter partners email',
		customBlurHandler,
		isDisabled: disabled,
	},
	{
		name: 'adminEndUrl',
		fieldType: 'textField',
		label: 'Admin End Url',
		description: details?.adminEndUrl?.description || 'Url for admin end',
		placeholder: 'Enter admin end url',
		customBlurHandler,
		isDisabled: disabled,
	},

	{
		name: 'xpRequirements',
		fieldType: 'textField',
		label: 'VIP XP Requirement',
		description: details?.xpRequirements?.description || 'VIP XP Requirement',
		placeholder: 'Enter VIP XP Requirement',
		customBlurHandler,
		isDisabled: disabled,
	},

	{
		name: 'logo',
		fieldType: 'file',
		description: details?.logo?.description,
		label: 'Application Logo',
		placeholder: 'Enter application logo',
		showThumbnail: true,
		customThumbnailBackground: '#1A1D29',
		customPadding: '8px',
		callBack: customBlurHandler,
		isDisabled: disabled,
	},

	{
		name: 'purchaseCooldown',
		fieldType: 'textField',
		label: 'Purchase Cooldown Time',
		description: details?.purchaseCooldown?.description || 'Purchase Cooldown Time',
		placeholder: 'Enter Purchase Cooldown Time',
		customBlurHandler,
		isDisabled: disabled,
	},
];

const rightStaticSiteConfigFormFields = (
	details,
	customBlurHandler,
	disabled = false
) => [
	{
		name: 'defaultSupport',
		fieldType: 'textField',
		description: details?.defaultSupport?.description,
		label: 'Support email',
		placeholder: 'Enter support email',
		customBlurHandler,
		isDisabled: disabled,
	},
	{
		name: 'legalSupport',
		fieldType: 'textField',
		description: details?.legalSupport?.description,
		label: 'Media email',
		placeholder: 'Enter media email',
		customBlurHandler,
		isDisabled: disabled,
	},
	{
		name: 'userEndUrl',
		fieldType: 'textField',
		label: 'User end Url',
		description: details?.userEndUrl?.description,
		placeholder: 'Enter user end url',
		customBlurHandler,
		isDisabled: disabled,
	},

	{
		name: 'footerLandingPage',
		fieldType: 'textField',
		label: 'Landing Page Footer Description',
		description:
			details?.footerLandingPage?.description ||
			'Landing Page Footer Description',
		placeholder: 'Enter Landing Page Footer Description',
		customBlurHandler,
		isDisabled: disabled,
	},

	{
		name: 'footerLobbyPage',
		fieldType: 'textField',
		label: 'Lobby Page Footer Description',
		description:
			details?.footerLobbyPage?.description || 'Lobby Page Footer Description',
		placeholder: 'Enter Lobby Page Footer Description',
		customBlurHandler,
		isDisabled: disabled,
	},
	// {
	// 	name: 'maxOdds',
	// 	fieldType: 'textField',
	// 	label: 'Max odds',
	// 	description: details?.maxOdds?.description,
	// 	placeholder: 'Enter max odds',
	// 	customBlurHandler,
	// },
];

const leftAppSettingsFormFields = (
	details,
	customOnChange,
	disabled = false
) => [
	{
		name: 'casino',
		fieldType: 'toggle',
		description: details?.casino?.description,
		label: 'Casino',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 py-1',
		containerClass: 'false',
		callBack: customOnChange,
		divClass: 'mb-5',
		disabled,
	},
	{
		name: 'depositPhoneRequired',
		fieldType: 'toggle',
		description: details?.depositPhoneRequired?.description,
		label: 'Purchase Phone Required',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 py-1',
		containerClass: 'false',
		callBack: customOnChange,
		divClass: 'mb-5',
		disabled,
	},
	{
		name: 'withdrawKycRequired',
		fieldType: 'toggle',
		description: details?.withdrawKycRequired?.description,
		label: 'Redeem Kyc Required',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 py-1',
		containerClass: 'false',
		callBack: customOnChange,
		divClass: 'mb-5',
		disabled,
	},
	{
		name: 'withdrawProfileRequired',
		fieldType: 'toggle',
		description: details?.withdrawProfileRequired?.description,
		label: 'Redeem Profile Required',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 py-1',
		containerClass: 'false',
		callBack: customOnChange,
		divClass: 'mb-5',
		disabled,
	},
	{
		name: 'gamePlayeKycRequired',
		fieldType: 'toggle',
		label: 'Game Play Kyc Required',
		description: details?.gamePlayeKycRequired?.description,
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 py-1',
		containerClass: 'false',
		callBack: customOnChange,
		divClass: 'mb-5',
		disabled,
	},
];

const rightAppSettingFormFields = (
	details,
	customOnChange,
	disabled = false
) => [
	{
		name: 'maintenance',
		fieldType: 'toggle',
		label: 'Maintenance',
		description: details?.maintenance?.description,
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 py-1',
		containerClass: 'false',
		callBack: customOnChange,
		divClass: 'mb-5',
		disabled,
	},
	{
		name: 'depositKycRequired',
		fieldType: 'toggle',
		label: 'Purchase Kyc Required',
		description: details?.depositKycRequired?.description,
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 py-1',
		containerClass: 'false',
		callBack: customOnChange,
		divClass: 'mb-5',
		disabled,
	},
	{
		name: 'depositProfileRequired',
		fieldType: 'toggle',
		label: 'Purchase Profile Required',
		description: details?.depositProfileRequired?.description,
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 py-1',
		containerClass: 'false',
		callBack: customOnChange,
		divClass: 'mb-5',
		disabled,
	},
	{
		name: 'withdrawPhoneRequired',
		fieldType: 'toggle',
		description: details?.withdrawPhoneRequired?.description,
		label: 'Redeem Phone Required',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 py-1',
		containerClass: 'false',
		callBack: customOnChange,
		divClass: 'mb-5',
		disabled,
	},
	// {
	// 	name: 'sportsbook',
	// 	fieldType: 'toggle',
	// 	label: 'Sports book',
	// 	description: details?.sportsbook?.description,
	// 	switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 py-1',
	// 	containerClass: 'false',
	// 	callBack: customOnChange,
	// 	divClass: 'mb-5',
	// },
];

export {
	adminSiteConfigSchema,
	getSiteConfigInitialValues,
	leftStaticSiteConfigFormFields,
	rightStaticSiteConfigFormFields,
	leftAppSettingsFormFields,
	rightAppSettingFormFields,
	getAppSettingInitialValues,
	BOOL,
	appSettingValidation,
};
