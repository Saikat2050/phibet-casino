import * as Yup from 'yup';
import moment from 'moment';
import { TIMEZONES, TOP_PLAYER_ORDER } from '../DashboardView/constant';

const staticFiltersFields = () => [
	// {
	// 	name: 'searchString',
	// 	fieldType: 'textField',
	// 	type: 'search',
	// 	label: '',
	// 	placeholder: 'Search by username',
	// },
	{
		name: 'orderBy',
		fieldType: 'select',
		label: '',
		placeholder: 'Order By',
		optionList: TOP_PLAYER_ORDER.map(({ value, label }) => ({
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
	{
		name: 'timezone',
		fieldType: 'select',
		label: '',
		placeholder: 'Select Timezone',
		optionList: TIMEZONES.map((tz) => ({
			id: tz.code,
			value: tz.code,
			optionLabel: `${tz.label} (${tz.value})`,
		})),
	},
];
// const fromDate = moment().subtract(1, 'month').toDate(); // Do not define it inside filterValue function
// const toDate = new Date(); // Do not define it inside filterValue function

const filterValues = () => {
	const today = moment();
	const threeDaysAgo = moment().subtract(3, 'days');

	return {
		searchString: '',
		currencyId: '',
		orderBy: null,
		fromDate: threeDaysAgo.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
		toDate: today.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
		range: '',
		timezone: 'GMT',
	};
};

const filterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
		currencyId: Yup.string().nullable(),
		orderBy: Yup.string().nullable(),
		fromDate: Yup.string().nullable(),
		toDate: Yup.string().nullable(),
		range: Yup.string().nullable(),
		timezone: Yup.string().nullable(),
	});

export { staticFiltersFields, filterValues, filterValidationSchema };
