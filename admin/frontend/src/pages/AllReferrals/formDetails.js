import * as Yup from 'yup';

const referralSchema = Yup.object().shape({
	bscQuantity: Yup.number()
		.min(0.01, 'BSC quantity must be greater than 0.')
		.required('BSC quantity is required!')
		.max(1000, 'BSC quantity must be less than or equal to 1000.'),
	gcQuantity: Yup.number()
		.min(0, 'GC quantity must be greater than or equal to 0.')
		.max(100000, 'GC quantity must be less than or equal to 100,000.'),
	limit: Yup.number()
		.integer('Limit must be an integer')
		.min(0.01, 'Limit must be greater than 0.')
		.required('Limit is required!')
		.max(200, 'Limit must be less than or equal to 200.'),
});

const getReferralInitialValues = (details) => {
	let bsc = 0;
	let gc = 0;
	details?.currency?.forEach(({ code, coins }) => {
		if (code === 'BSC') {
			bsc = coins;
		} else if (code === 'GC') {
			gc = coins;
		}
	});
	return {
		bscQuantity: bsc ?? 0,
		gcQuantity: gc ?? 0,
		status: details?.isActive ?? false,
		limit: details?.limit ?? 0,
	};
};

const staticFormFields = () => [
	{
		name: 'status',
		fieldType: 'toggle',
		topDescription: 'Player can refer website to other non register players.',
		label: 'Allow Referral',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 pt-3',
		containerClass: 'false',
		divClass: 'mb-5',
	},
	{
		name: 'bscQuantity',
		fieldType: 'textField',
		label: 'BSC Quantity',
		type: 'number',
		placeholder: 'Enter BSC quantity player get on referral',
	},
	{
		name: 'gcQuantity',
		fieldType: 'textField',
		label: 'GC Quantity',
		type: 'number',
		placeholder: 'Enter GC quantity player get on referral',
	},
	{
		name: 'limit',
		fieldType: 'textField',
		label:
			'Daily Referral Limit (Maximum number of referrals each player can make)',
		type: 'number',
		placeholder: 'Enter daily referral limit',
	},
];

export { referralSchema, getReferralInitialValues, staticFormFields };
