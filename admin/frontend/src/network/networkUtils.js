const API_NAMESPACE = '/api/v1';
const MANAGEMENT = {
	CASINO: '/casino-management/',
	CONTENT: '/content-management/',
	PLAYER: '/player-management/',
	SETTINGS: '/settings/',
	LANGUAGE: '/language/',
	SPORTS: '/sportsbook-management/',
	ADMIN: '/admin/',
	COUNTRY: '/country/',
	REPORT: '/report/',
	TRANSACTION: '/transaction/',
	DASHBOARD: '/dashboard/',
	BONUS: '/bonus-management/',
	TOURNAMENT: '/tournament',
	PAYMENT: '/payment/',
	DISPUTE: '/dispute-management/',
	CHAT: '/live-chat/',
	INTERNAL: '/internal/',
	STORE: '/store/',
	AMOE: '/AMOE/',
	VIP: '/vip/',
};

const METHODS = {
	get: 'GET',
	post: 'POST',
	put: 'PUT',
	delete: 'DELETE',
};

const isFormData = (payload) => payload instanceof FormData;

const filterEmptyPayload = (payload) => {
	if (isFormData(payload)) return payload;
	const updatedPayload = {};
	Object.keys(payload || {}).forEach((key) => {
		if (
			!(
				payload[key] === null ||
				payload[key] === undefined ||
				payload[key] === ''
			)
		) {
			updatedPayload[key] = payload[key];
		}
	});
	return updatedPayload;
};

const MESSAGES = {
	LIMIT_DOES_NOT_EXISTS: 'The limit does not exist.',
	DOCUMENT_REQUIRES_APPROVAL_BEFORE_PROCEEDING:
		'Document requires approval before proceeding.',
	INVALID_WALLET_ID: 'Invalid wallet ID.',
	SERVICE_UNAVAILABLE: 'Service unavailable.',
	TAG_IS_NOT_ATTACHED: 'Tag is not attached.',
	NOT_ENOUGH_AMOUNT: 'Not enough amount.',
	CANNOT_DELETE_DEFAULT_EMAIL_TEMPLATE: 'Cannot delete default email template.',
	BANNER_NOT_FOUND: 'Banner not found.',
	INVALID_IMAGE_NAME: 'Invalid image name.',
	INVALID_SPORTSBOOK_ICON_TYPE: 'Invalid sportsbook icon type.',
	PAGE_NOT_FOUND: 'Page not found.',
	DOCUMENT_LABEL_EXISTS: 'Document label exists.',
	PAGE_SLUG_ALREADY_EXISTS: 'Page slug already exists.',
	CANNOT_DEACTIVATE_DEFAULT_CURRENCY: 'Cannot deactivate default currency.',
	ADMIN_USER_NOT_FOUND: 'Admin user not found.',
	PARENT_ADMIN_NOT_FOUND: 'Parent admin not found.',
	CHILD_ADMIN_USER_NOT_FOUND: 'Child admin user not found.',
	CURRENCY_ALREADY_EXISTS: 'Currency already exists.',
	LANGUAGE_NOT_FOUND: 'Language not found.',
	COMMENT_DOES_NOT_EXISTS: 'Comment does not exist.',
	COUNTRY_NOT_FOUND: 'Country not found.',
	CURRENCY_NOT_FOUND: 'Currency not found.',
	INVALID_PASSWORD: 'Invalid password.',
	PASSWORD_MISMATCH: 'Old password mismatch.',
	SPORT_NOT_FOUND: 'Sport not found.',
	LEAGUE_NOT_FOUND: 'League not found.',
	LOCATION_NOT_FOUND: 'Location not found.',
	EVENT_NOT_FOUND: 'Event not found.',
	TAG_ALREADY_ATTACHED: 'Tag already attached.',
	TAG_ALREADY_EXIST: 'Tag already exists.',
	AGGREGATOR_NOT_FOUND: 'Aggregator not found.',
	PROVIDER_NOT_FOUND: 'Provider not found.',
	SUB_CATEGORY_NOT_FOUND: 'Sub category not found.',
	CATEGORY_NOT_FOUND: 'Category not found.',
	USER_DOES_NOT_EXISTS: 'User does not exist.',
	MISSING_ACCESS_TOKEN: 'Missing access token.',
	INVALID_ACCESS_TOKEN: 'Invalid access token.',
	GAME_NOT_FOUND: 'Game not found.',
	INVALID_ID: 'Invalid ID.',
	CATEGORY_ALREADY_EXISTS: 'Category already exists.',
	SUB_CATEGORY_ALREADY_EXISTS: 'Sub category already exists.',
	INVALID_TOKEN: 'Invalid token.',
	EMAIL_ALREADY_EXISTS: 'Email already exists.',
	EMAIL_NOT_VERIFIED: 'Email not verified.',
	USERNAME_ALREADY_EXISTS: 'Username already exists.',
	FILE_FORMAT_NOT_SUPPORTED: 'File format not supported.',
	INVALID_ROLE_ID: 'Invalid role ID.',
	INVALID_TYPE: 'Invalid type.',
	DOCUMENT_ALREADY_APPROVED: 'Document already approved.',
	DOCUMENTS_NOT_AVAILABLE: 'Documents not available.',
	DOCUMENT_LABEL_DOES_NOT_EXISTS: 'Document label does not exist.',
	EMAIL_TEMPLATE_NOT_FOUND: 'Email template not found.',
	NO_EXISTING_TEMAPLATE_FOUND_FOR_THIS_EVENT_TYPE:
		'No existing template found for this event type.',
	MOVE_ALL_THE_GAMES_TO_ANOTHER_SUB_CATEGORY:
		'Move all the games to another sub category.',
	SUPER_ADMIN_ROLE_CAN_NOT_BE_ASSIGNED_TO_OTHER_ADMIN_USERS:
		'Super admin role cannot be assigned to other admin users.',
	CHILD_ROLE_CANNOT_BE_SAME_AS_PARENT: 'Child role cannot be same as parent.',
	OLD_PASSWORD_AND_NEW_PASSOWRD_MUST_NOT_BE_SAME:
		'Old password and new password must not be same.',
	MAX_ODDS_SHOULD_BE_GREATER_THEN_MIN_ODDS:
		'Max odds should be greater than min odds.',
	'DAILY LIMIT CANNOT EXCEED THE WEEKLY OR MONTHLY LIMIT':
		'Daily limit cannot exceed the weekly or monthly limit.',
	'MONTHLY LIMIT CANNOT BE LOWER THAN THE DAILY OR WEEKLY LIMIT':
		'Monthly limit cannot be lower than the daily or weekly limit.',
	'WEEKLY LIMIT CANNOT EXCEED THE MONTHLY LIMIT OR BE LOWER THAN THE MONTHLY LIMIT':
		'Weekly limit cannot exceed the monthly limit or be lower than the monthly limit.',
	ACTIVE_BONUS_EXISTS: 'Bonus already exists',
	BONUS_UNDER_CLAIM: 'Bonus is under claim',
	PLEASE_CHECK_REQUEST_DATA: 'Please check the requested data',
	MOVE_ALL_THE_GAMES_TO_ANOTHER_CATEGORY:
		'Remove all the games from this category.',
	TOURNAMENT_USER_DOES_NOT_EXISTS: 'Tournament user does not exists.',
	TOURNAMENT_SETTLED_OR_CANCELLED: 'Tournament settled or cancelled.',
	REFERRAL_DOES_NOT_EXISTS: 'Referral does not exist.',
	ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED: 'Access token expired or not passed',
	NOT_ENOUGH_PERMISSION: 'You do not permission to visit the page.',
};

export { API_NAMESPACE, METHODS, filterEmptyPayload, MANAGEMENT, MESSAGES };
