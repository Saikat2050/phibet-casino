import * as Yup from 'yup';

export const WITHDRAWAL_STATUS_TYPES = [
	{ id: '1', label: 'All', value: 'all' },
	{ id: '2', label: 'Pending', value: 'pending' },
	{ id: '3', label: 'Approved', value: 'approved' },
	{ id: '4', label: 'Rejected', value: 'rejected' },
	{ id: '5', label: 'In-Progress', value: 'in_progress' },
	{ id: '6', label: 'Failed', value: 'failed' },
];

// Filters
const staticFiltersFields = () => [
	{
		name: 'status',
		fieldType: 'select',
		label: '',
		placeholder: 'Status',
		optionList: WITHDRAWAL_STATUS_TYPES.map(({ id, label, value }) => ({
			id,
			optionLabel: label,
			value,
		})),
	},
	{
		name: 'userId',
		fieldType: 'textField',
		type: 'number',
		label: '',
		placeholder: 'Search by Player Id',
	},
	{
		name: 'ranges',
		fieldType: 'dateRangeSelector',
		label: '',
		placeholder: 'Registration date range',
	},
];

const filterValues = () => ({
	// status: 'all',
});

const filterValidationSchema = () =>
	Yup.object({
		status: Yup.string().nullable(),
	});

export { staticFiltersFields, filterValues, filterValidationSchema };
