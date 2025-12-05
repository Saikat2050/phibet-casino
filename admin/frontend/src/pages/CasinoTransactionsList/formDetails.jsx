import * as Yup from 'yup';
import moment from 'moment';
import { LEDGER_PURPOSE, STATUS_TYPE } from './constants';

const staticFiltersFields = (userId = '') => [
	{
		name: 'searchString',
		fieldType: 'textField',
		type: 'search',
		label: '',
		placeholder: 'Search by username',
		isHide: !!userId,
	},
	{
		name: 'gameName',
		fieldType: 'textField',
		type: 'search',
		label: '',
		placeholder: 'Search by game name',
	},
	{
		name: 'transactionId',
		fieldType: 'textField',
		placeholder: 'Search by transaction id',
		type: 'search',
	},
	// {
	// 	name: 'previousTransactionId',
	// 	fieldType: 'textField',
	// 	placeholder: 'Search by previous transaction id',
	// 	type: 'search',
	// },
	{
		name: 'purpose',
		fieldType: 'select',
		label: '',
		placeholder: 'Transaction Type',
		optionList: LEDGER_PURPOSE.map(({ value, label }) => ({
			id: value,
			value,
			optionLabel: label,
		})),
	},
	{
		name: 'status',
		fieldType: 'select',
		label: '',
		placeholder: 'Status',
		optionList: STATUS_TYPE.map(({ value, label }) => ({
			id: value,
			value,
			optionLabel: label,
		})),
	},
	{
		name: 'ranges',
		fieldType: 'dateRangeSelector',
		label: '',
		placeholder: 'Date Range',
	},
];
// const fromDate = moment().subtract(1, 'month').toDate(); // Do not define it inside filterValue function
// const toDate = new Date(); // Do not define it inside filterValue function

const filterValues = () => {
	const today = moment();
	const threeDaysAgo = moment().subtract(3, 'days');

	return {
		gameName: '',
		searchString: '',
		fromDate: threeDaysAgo.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
		toDate: today.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
		gameId: '',
		walletId: '',
		actioneeId: '',
		transactionId: '',
		conversionRate: '',
		// previousTransactionId: '',
		// transactionType: null,
		purpose: null,
		status: null,
		currencyId: null,
	};
};

const filterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
		gameName: Yup.string().nullable(),
		status: Yup.string().nullable(),
		fromDate: Yup.string().nullable(),
		toDate: Yup.string().nullable(),
		transactionType: Yup.string().nullable(),
		gameId: Yup.string().nullable(),
		walletId: Yup.string().nullable(),
		actioneeId: Yup.string().nullable(),
		transactionId: Yup.string().nullable(),
		conversionRate: Yup.string().nullable(),
		// previousTransactionId: Yup.string().nullable(),
		purpose: Yup.string().nullable(),
		currencyId: Yup.string().nullable(),
	});

export { staticFiltersFields, filterValues, filterValidationSchema };
