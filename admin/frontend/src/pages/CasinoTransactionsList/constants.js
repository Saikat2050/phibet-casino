export const STATUS_TYPE = [
	// { label: 'All', value: 'all' },
	{ label: 'Pending', value: 'pending' },
	{ label: 'Complete', value: 'completed' },
	{ label: 'Failed', value: 'failed' },
	// { label: 'RollBack', value: 'rollback' },
];

export const IS_ACTIVE_TYPES = [
	{ id: '1', label: 'Active', value: true },
	{ id: '2', label: 'In Active', value: false },
];

export const GENDER_TYPES = [
	{ id: '1', label: 'Male', value: 'male' },
	{ id: '2', label: 'Female', value: 'female' },
	// {id: '3', label: 'Other', value: 'other'}
];

export const LEDGER_TYPES = [
	{ label: 'Debit', value: 'debit' },
	{ label: 'Credit', value: 'credit' },
];

export const LEDGER_PURPOSE = [
	{ label: 'Wagered', value: 'CasinoBet' },
	{ label: 'Payout', value: 'CasinoWin' },
	{ label: 'Refund', value: 'CasinoRefund' },
	{ label: 'Win Rollback', value: 'CasinoBetRollback' },
	{ label: 'Bet Rollback', value: 'CasinoWinRollback' },
];
