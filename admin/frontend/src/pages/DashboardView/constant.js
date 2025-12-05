import moment from 'moment';

/* eslint-disable import/prefer-default-export */
export const dateConstants = [
	{ label: 'Today', value: 'today' },
	{ label: 'Yesterday', value: 'yesterday' },
	{ label: 'Last 7 Days', value: 'last7days' },
	{ label: 'Last 30 Days', value: 'last30days' },
	{ label: 'Last 90 Days', value: 'last90days' },
	{ label: 'Custom', value: 'custom' },
];

export const TOP_ITEMS_OPTIONS = [
	{ value: 5, label: 'Top 5' },
	{ value: 10, label: 'Top 10' },
	{ value: 15, label: 'Top 15' },
	{ value: 20, label: 'Top 20' },
	{ value: 25, label: 'Top 25' },
];

export const TABS = {
	GAME: 'game',
	PROVIDER: 'provider',
	SPORT: 'sport',
	CASINO: 'casino',
	WITHDRAW: 'withdraw',
	DEPOSIT: 'deposit',
	PURCHASE: 'purchase',
	REDEEM: 'redeem',
};

export const GAME_ORDER_BY = [
	{
		label: 'Top wagered ',
		value: 'totalBetAmount',
	},
	// {
	// 	label: 'Most played ',
	// 	value: 'totalPlayers',
	// },
	{
		label: 'Top payout ',
		value: 'totalWinAmount',
	},
];

export const topPlayerOrder = [
	{
		value: 'netProfit',
		label: 'Net Profit',
	},
	{
		value: 'scRewards',
		label: 'SC Rewards',
	},
	{
		value: 'scStakedAmount',
		label: 'SC Wagered Amount',
	},
	{
		value: 'scBetCount',
		label: 'SC Bet Count',
	},
	{
		value: 'scCasinoWins',
		label: 'SC Casino Wins',
	},
	{
		value: 'scCasinoBetRollback',
		label: 'SC Casino Bet Rollback',
	},
	{
		value: 'scCasinoWinRollback',
		label: 'SC Casino Win Rollback',
	},
	{
		value: 'scPurchases',
		label: 'SC Purchases',
	},
	{
		value: 'gcRewards',
		label: 'GC Rewards',
	},
	{
		value: 'gcPurchases',
		label: 'GC Purchases',
	},
	{
		value: 'gcStakedAmount',
		label: 'GC Wagered Amount',
	},
	{
		value: 'gcBetCount',
		label: 'GC Bet Count',
	},
	{
		value: 'gcCasinoWins',
		label: 'GC Casino Wins',
	},
	{
		value: 'gcCasinoBetRollback',
		label: 'GC Casino Bet Rollback',
	},
	{
		value: 'gcCasinoWinRollback',
		label: 'GC Casino Win Rollback',
	},
	{
		value: 'redeemCompletedAmount',
		label: 'Redeem Completed Amount',
	},
	{
		value: 'redeemFailedAmount',
		label: 'Redeem Failed Amount',
	},
	{
		value: 'redeemRejectedAmount',
		label: 'Redeem Rejected Amount',
	},
];

export const TOP_PLAYER_ORDER = topPlayerOrder;

export const KPI_SUMMARY_NAMES = [
	{
		label: 'Wagered Amount',
		value: 'betamount',
		isAmount: true,
	},
	{
		label: 'Payout Amount',
		value: 'winamount',
		isAmount: true,
	},
	{
		label: 'Payout Count',
		value: 'wincount',
	},
	{
		label: 'Wagered Count',
		value: 'betcount',
	},
];

export const TAB_COLORS = {
	primary: 'bg-primary-subtle',
	danger: 'bg-danger-subtle',
	success: 'bg-success-subtle',
	info: 'bg-info-subtle',
	warn: 'bg-warning-subtle',
};

export const INITIAL_FILTERS = {
	fromDate: new Date(moment().subtract(7, 'days')),
	toDate: new Date(),
	timezone: 'GMT',
};

export const TIMEZONES = [
	{
		label: 'International Date Line West',
		code: 'IDLW',
		value: '-12:00',
		offset: -12 * 60,
	},
	{ label: 'Nome Time', code: 'NT', value: '-11:00', offset: -11 * 60 },
	{
		label: 'Hawaii Standard Time',
		code: 'HST',
		value: '-10:00',
		offset: -10 * 60,
	},
	{
		label: 'Alaska Standard Time',
		code: 'AKST',
		value: '-09:00',
		offset: -9 * 60,
	},
	{
		label: 'Pacific Standard Time',
		code: 'PST',
		value: '-08:00',
		offset: -8 * 60,
	},
	{
		label: 'Mountain Standard Time',
		code: 'MST',
		value: '-07:00',
		offset: -7 * 60,
	},
	{
		label: 'Central Standard Time',
		code: 'CST',
		value: '-06:00',
		offset: -6 * 60,
	},
	{
		label: 'Eastern Standard Time',
		code: 'EST',
		value: '-05:00',
		offset: -5 * 60,
	},
	{
		label: 'Atlantic Standard Time',
		code: 'AST',
		value: '-04:00',
		offset: -4 * 60,
	},
	{
		label: 'Newfoundland Standard Time',
		code: 'NST',
		value: '-03:30',
		offset: -3 * 60 - 30,
	},
	{ label: 'Brasília Time', code: 'BRT', value: '-03:00', offset: -3 * 60 },
	{
		label: 'South Georgia and the South Sandwich Islands Time',
		code: 'GST-2',
		value: '-02:00',
		offset: -2 * 60,
	},
	{
		label: 'Azores Standard Time',
		code: 'AZOT',
		value: '-01:00',
		offset: -1 * 60,
	},
	{ label: 'Greenwich Mean Time', code: 'GMT', value: '+00:00', offset: 0 },
	{
		label: 'Central European Time',
		code: 'CET',
		value: '+01:00',
		offset: 1 * 60,
	},
	{
		label: 'Eastern European Time',
		code: 'EET',
		value: '+02:00',
		offset: 2 * 60,
	},
	{
		label: 'Moscow Standard Time',
		code: 'MSK',
		value: '+03:00',
		offset: 3 * 60,
	},
	{
		label: 'Iran Standard Time',
		code: 'IRST',
		value: '+03:30',
		offset: 3 * 60 + 30,
	},
	{ label: 'Gulf Standard Time', code: 'GST', value: '+04:00', offset: 4 * 60 },
	{
		label: 'Indian Standard Time',
		code: 'IST',
		value: '+05:30',
		offset: 5 * 60 + 30,
	},
	{
		label: 'Bangladesh Standard Time',
		code: 'BST',
		value: '+06:00',
		offset: 6 * 60,
	},
	{ label: 'Indochina Time', code: 'ICT', value: '+07:00', offset: 7 * 60 },
	{
		label: 'China Standard Time',
		code: 'CST+8',
		value: '+08:00',
		offset: 8 * 60,
	},
	{
		label: 'Japan Standard Time',
		code: 'JST',
		value: '+09:00',
		offset: 9 * 60,
	},
	{
		label: 'Australian Central Standard Time',
		code: 'ACST',
		value: '+09:30',
		offset: 9 * 60 + 30,
	},
	{
		label: 'Australian Eastern Standard Time',
		code: 'AEST',
		value: '+10:00',
		offset: 10 * 60,
	},
	{
		label: 'Solomon Islands Time',
		code: 'SBT',
		value: '+11:00',
		offset: 11 * 60,
	},
	{
		label: 'New Zealand Standard Time',
		code: 'NZST',
		value: '+12:00',
		offset: 12 * 60,
	},
	{
		label: 'New Zealand Daylight Time',
		code: 'NZDT',
		value: '+13:00',
		offset: 13 * 60,
	},
	{
		label: 'Line Islands Time',
		code: 'LINT',
		value: '+14:00',
		offset: 14 * 60,
	},
];

export const CURRENCY_OPTIONS = [
	{ id: '0', label: 'Sweeps Coins', value: 'SC Coins' },
	{ id: '1', label: 'Gold Coins', value: 'goldCoins' },
	{ id: '2', label: 'Bonus Sweeps Coins', value: 'bonusSweepsCoins' },
	{ id: '3', label: 'Purchased Sweeps Coins', value: 'purchasedSweepsCoins' },
	{ id: '4', label: 'Redeemable Sweeps Coins', value: 'redeemableSweepsCoins' },
];
