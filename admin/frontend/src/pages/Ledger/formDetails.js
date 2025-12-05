import * as Yup from 'yup';
import moment from 'moment';
import { LEDGER_PURPOSE } from '../../utils/constant';

const staticFiltersFields = (userId = '') => [
	{
		name: 'searchString',
		fieldType: 'textField',
		type: 'search',
		label: '',
		placeholder: 'Search by username',
		isHide: !userId,
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
	// {
	// 	name: 'dateOptions',
	// 	fieldType: 'select',
	// 	label: '',
	// 	placeholder: 'Date Options',
	// 	optionList: REPORT_TIME_PERIOD.map(({ value, label }) => ({
	// 		id: value,
	// 		value,
	// 		optionLabel: label,
	// 	})),
	// },
	{
		name: 'ranges',
		fieldType: 'dateRangeSelector',
		label: '',
		placeholder: 'Date Range',
	},
];

const filterValues = () => {
	const today = moment();
	const threeDaysAgo = moment().subtract(3, 'days');

	return {
		searchString: '',
		fromDate: threeDaysAgo.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
		toDate: today.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
		purpose: null,
		dateOptions: null,
	};
};

const filterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
		status: Yup.string().nullable(),
		fromDate: Yup.string().nullable(),
		toDate: Yup.string().nullable(),
		purpose: Yup.string().nullable(),
	});

export { staticFiltersFields, filterValues, filterValidationSchema };
