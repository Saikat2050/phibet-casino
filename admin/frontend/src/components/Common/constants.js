const rowsPerPageOptions = [
	{
		id: 1,
		optionLabel: 10,
		value: 10,
	},
	{
		id: 2,
		optionLabel: 15,
		value: 15,
	},
	{
		id: 3,
		optionLabel: 20,
		value: 20,
	},
	{
		id: 4,
		optionLabel: 25,
		value: 25,
	},
	{
		id: 5,
		optionLabel: 30,
		value: 30,
	},
];

const defaultPageSize = 10;

const formPageTitle = {
	staff: 'STAFF_DETAIL_FORM',
	user: 'PLAYER_DETAIL_FORM',
	kyc: 'KYC_DETAIL_FORM',
	currencies: 'CURRENCY_DETAIL_FORM',
	countries: 'COUNTRY_DETAIL_FORM',
	cms: 'CMS_DETAIL_FORM',
	crm: 'EMAIL_TEMPLATE_DETAIL_FORM',
	aggregators: 'AGGREGATORS_DETAIL_FORM',
	providers: 'PROVIDERS_DETAIL_FORM',
	categories: 'CATEGORIES_DETAIL_FORM',
	subCategories: 'SUB_CATEGORIES_DETAIL_FORM',
	games: 'GAMES_DETAIL_FORM',
	bannerManagement: 'BANNER_MANAGEMENT_DETAIL_FORM',
	wageringTemplate: 'WAGERING_TEMPLATE_DETAIL_FORM',
	bonusManagement: 'BONUS_MANAGEMENT_DETAIL_FORM',
	reviewManagement: 'REVIEW_MANAGEMENT_DETAIL_FORM',
	betSettings: 'BET_SETTINGS_DETAIL_FORM',
	notes: 'NOTES_DETAIL_FORM',
	notification: 'NOTIFICATION_FORM',
};

const STORAGE_KEY = {
	ADMIN_EDIT: 'admin_edit_key',
	ADMIN_VIEW: 'admin_view_key',
	DASH_CONFIG: 'dashboard_configs',
};

export { rowsPerPageOptions, defaultPageSize, formPageTitle, STORAGE_KEY };
