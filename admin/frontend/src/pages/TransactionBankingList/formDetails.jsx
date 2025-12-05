import * as Yup from 'yup';
import moment from 'moment';
import { STATUS_TYPE, LEDGER_PURPOSE } from './constants';

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
		searchString: '',
		status: null,
		fromDate: threeDaysAgo.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
		toDate: today.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
		type: null,
		purpose: null,
		tagIds: null,
	};
};

const filterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
		status: Yup.string().nullable(),
		fromDate: Yup.string().nullable(),
		toDate: Yup.string().nullable(),
		type: Yup.string().nullable(),
		purpose: Yup.string().nullable(),
		tagIds: Yup.string().nullable(),
	});

export { staticFiltersFields, filterValues, filterValidationSchema };
