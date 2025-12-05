export const DISPUTE_STATUS = [
	{
		label: 'Active',
		value: 'active',
	},
	{
		label: 'Resolved',
		value: 'resolved',
	},
	{
		label: 'Re-opened',
		value: 'reopened',
	},
];

export const DISPUTE_STATUS_COLOR = {
	pending: {
		color: 'danger',
	},
	active: {
		color: 'primary',
	},
	resolved: {
		color: 'success',
	},
	reopened: {
		color: 'warning',
	},
};
