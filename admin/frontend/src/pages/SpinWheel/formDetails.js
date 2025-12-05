import * as Yup from 'yup';

const MAX_GC_COIN = 5000;
const MAX_SC_COIN = 5000;
const MAX_PLAYER_LIMIT = 5000;

const SPIN_WHEEL_PRIORITY = [
	{ id: 1, value: 1, label: 'Rarely' },
	{ id: 2, value: 2, label: 'Sometimes' },
	{ id: 3, value: 3, label: 'Usually' },
	{ id: 4, value: 4, label: 'Frequently' },
	{ id: 5, value: 5, label: 'Most of the time' },
];

const SpinWheelSchema = Yup.object().shape({
	gc: Yup.number()
		.min(0, 'GC Coin should be greater or equal to 0')
		.max(MAX_GC_COIN, `GC Coin should be less than or equal to ${MAX_GC_COIN}`)
		.required('GC Coin required'),
	sc: Yup.number()
		.min(0, 'SC Coin should be greater or equal to 0')
		.max(MAX_SC_COIN, `SC Coin should be less than or equal to ${MAX_SC_COIN}`)
		.required('SC Coin required'),
	playerLimit: Yup.number()
		.min(1, 'Player Limit should be greater than 0')
		.max(
			MAX_PLAYER_LIMIT,
			`Player Limit should be less than or equal to ${MAX_PLAYER_LIMIT}`
		)
		.required('Player Limit required'),
});

const getSpinwheelInitialValues = (data) => ({
	id: data?.id ?? '',
	sc: data?.sc ?? '',
	gc: data?.gc ?? '',
	isAllow: data?.isActive ?? false,
	playerLimit: data?.id === '1' ? 1 : data?.playerLimit ?? '',
	priority: data?.priority ?? '',
});

const staticFormFields = () => [
	{
		name: 'sc',
		fieldType: 'textField',
		label: 'SC Coin',
		placeholder: 'Enter SC Coin',
		isRequired: true,
	},
	{
		name: 'gc',
		fieldType: 'textField',
		label: 'GC Coin',
		placeholder: 'Enter GC Coin',
		isRequired: true,
	},
	{
		name: 'playerLimit',
		fieldType: 'textField',
		label: 'Player Limit',
		placeholder: 'Enter Player Limit',
		isRequired: true,
		hideId: true,
	},
	{
		name: 'isAllow',
		fieldType: 'toggle',
		label: 'Active',
		isNewRow: true,
		tooltipAlignment: 'left',
		tooltipContent: 'If True Status is Active else Inactive',
	},
	{
		name: 'priority',
		fieldType: 'select',
		label: 'Priority',
		placeholder: 'Priority',
		optionList: SPIN_WHEEL_PRIORITY.map(({ value, label }) => ({
			id: value,
			value,
			optionLabel: label,
		})),
	},
];

export {
	SpinWheelSchema,
	staticFormFields,
	getSpinwheelInitialValues,
	SPIN_WHEEL_PRIORITY,
};
