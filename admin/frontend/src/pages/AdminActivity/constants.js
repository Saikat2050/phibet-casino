const GENDER_OPTIONS = [
	{ value: 'male', label: 'Male' },
	{ value: 'female', label: 'Female' },
	{ value: 'unknown', label: 'Other' },
];

const DEVICE_TYPE_OPTIONS = [
	{ value: 'mobile', label: 'Mobile' },
	{ value: 'desktop', label: 'Desktop' },
	{ value: 'tablet', label: 'Tablet' },
	{ value: 'other', label: 'Other' },
];

const FIELD_TYPES = {
	SINGLE: 1,
	DOUBLE: 2,
	NONE: 0,
};

const getFieldType = (operator) => {
	switch (operator) {
		case 'eq':
		case 'ne':
		case 'lt':
		case 'lte':
		case 'gt':
		case 'gte':
		case 'like':
		case 'notLike':
		case 'exists':
		case 'notExists':
			return FIELD_TYPES.SINGLE;
		case 'in':
		case 'notIn':
		case 'between':
		case 'notBetween':
			return FIELD_TYPES.DOUBLE;
		case 'isNull':
		case 'isNotNull':
			return FIELD_TYPES.NONE;
		default:
			return FIELD_TYPES.NONE;
	}
};

const operators = {
	eq: 'equals',
	ne: 'not equal',
	lt: 'less than',
	lte: 'less than or equal',
	gt: 'greater than',
	gte: 'greater than or equal',
	in: 'included in',
	notIn: 'not included in',
	between: 'in range',
	notBetween: 'not in range',
	exists: 'exists',
	notExists: 'does not exist',
	isNull: 'is null',
	isNotNull: 'is not null',
	like: 'matches',
	notLike: 'does not match',
};

const dateTypeFelid = {
	signup: 'signup',
	last_login: 'last_login',
	last_played: 'last_played',
};
const dateTypeForValidation = {
	signup: 'signup',
	lastLogin: 'lastLogin',
	lastPlayed: 'lastPlayed',
};

const filterDataKey = {
	total_count: 'total_count',
	id: 'id',
	username: 'username',
};
const dateColumnsKey = {
	new_players_created_at_datetime: 'new_players_created_at_datetime',
	last_login: 'last_login',
	last_played: 'last_played',
	signup: 'signup',
};

const KYC_STATUS_OPTIONS = [
	{ value: 'PENDING', label: 'Pending' },
	{ value: 'COMPLETED', label: 'Completed' },
	{ value: 'FAILED', label: 'Failed' },
	{ value: 'IN_PROGRESS', label: 'In Progress' },
	// { value: '', label: 'Other' },
];

const maxFieldNum = 100000;

export {
	getFieldType,
	GENDER_OPTIONS,
	DEVICE_TYPE_OPTIONS,
	FIELD_TYPES,
	operators,
	dateTypeFelid,
	dateTypeForValidation,
	filterDataKey,
	dateColumnsKey,
	KYC_STATUS_OPTIONS,
	maxFieldNum,
};
