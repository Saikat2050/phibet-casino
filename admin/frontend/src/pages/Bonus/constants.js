export const BONUS_TYPES = {
	FREESPINS: 'freespins',
	JOINING: 'joining',
	BET: 'bet',
	AMOE_CODE: 'amoe_code',
	DAILY: 'daily_bonus',
	REFERRAL: 'referral_bonus',
};

const daysOfWeek = [
	{ label: 'Monday', value: 'Monday', id: 0 },
	{ label: 'Tuesday', value: 'Tuesday', id: 1 },
	{ label: 'Wednesday', value: 'Wednesday', id: 2 },
	{ label: 'Thursday', value: 'Thursday', id: 3 },
	{ label: 'Friday', value: 'Friday', id: 4 },
	{ label: 'Saturday', value: 'Saturday', id: 5 },
	{ label: 'Sunday', value: 'Sunday', id: 6 },
];

const bonusTypes = [
	{ label: 'AMOE CODE', value: BONUS_TYPES.AMOE_CODE, id: 3 },
	{ label: 'JOINING BONUS', value: BONUS_TYPES.JOINING, id: 1 },
	{ label: 'DAILY BONUS', value: BONUS_TYPES.DAILY, id: 2 },
	{ label: 'REFERRAL BONUS', value: BONUS_TYPES.REFERRAL, id: 4 },
	// { label: 'FREESPINS', value: BONUS_TYPES.FREESPINS, id: 2 },
	// { label: 'BET', value: BONUS_TYPES.BET, id: 4 },
];

const bonusLabel = {
	joining: 'JOINING BONUS',
	daily_bonus: 'DAILY BONUS',
	amoe_code: 'AMOE CODE',
	referral_bonus: 'REFERRAL BONUS',
};

const commonCurrencyFields = [
	{
		name: 'amount',
		label: 'Quantity',
		fieldType: 'textField',
		placeholder: 'Example: 100',
		type: 'number',
	},
];
const checkLabels = (bonusType) => {
	if ([BONUS_TYPES.BET, BONUS_TYPES.JOINING].includes(bonusType)) {
		return [
			{
				label: 'Active',
				value: 'isActive',
				message: 'If True Status is Active else Inactive',
			},
			{
				label: 'Visible In Promotions',
				value: 'visibleInPromotions',
				message: 'If true visible in promotion else not',
			},
		];
	}
	return [
		{
			label: 'Active',
			value: 'isActive',
			message: 'If True Status is Active else Inactive',
		},
	];
};

const daysLabels = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
];

const wageringRequirementType = [
	{ label: 'BONUS', value: 'bonus', id: 1 },
	{ label: 'BONUS+DEPOSIT', value: 'bonusdeposit', id: 2 },
];

const BONUS_KEY_RELATION = {
	[BONUS_TYPES.JOINING]: 'joiningBonus',
	[BONUS_TYPES.FREESPINS]: 'freespinBonus',
	[BONUS_TYPES.BET]: 'betBonus',
	[BONUS_TYPES.DAILY]: 'dailyBonus',
	[BONUS_TYPES.REFERRAL]: 'referralBonus',
};

export {
	bonusTypes,
	daysOfWeek,
	commonCurrencyFields,
	checkLabels,
	daysLabels,
	wageringRequirementType,
	BONUS_KEY_RELATION,
	bonusLabel,
};
