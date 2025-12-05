import * as Yup from 'yup';
import COUNTRIES from './contants';

const amoeSchema = Yup.object().shape({
	addressLine1: Yup.string()
		.test(
			'soft-validate-address',
			'Address Line 1 is too short (min 5 characters)',
			(value) => value && value.length >= 5
		)
		.max(40, 'Address Line 1 cannot be longer than 40 characters')
		.required('Address Line 1 is required!'),
	addressLine2: Yup.string()
		.test(
			'soft-validate-address',
			'Address Line 1 is too short (min 5 characters)',
			(value) => value && value.length >= 5
		)
		.max(40, 'Address Line 1 cannot be longer than 40 characters')
		.required('Address Line 1 is required!'),
	city: Yup.string()
		.test(
			'soft-validate-city',
			'City name might be too short (min 3 characters)',
			(value) => value && value.length >= 3
		)
		.max(30, 'City name cannot be longer than 30 characters')
		.required('City is required!'),
	state: Yup.string()
		.test(
			'soft-validate-state',
			'State code might be too short (min 2 characters)',
			(value) => value && value.length >= 2
		)
		.max(20, 'State code cannot be longer than 20 letters')
		.required('State is required!'),
	postalCode: Yup.string()
		.test(
			'soft-validate-postalCode',
			'Postal Code should be between 4 and 10 digits',
			(value) => value && value.length >= 4 && value.length <= 10
		)
		.min(4, 'Postal Code must be at least 4 digits')
		.max(10, 'Postal Code cannot exceed 10 digits')
		.required('Postal Code is required!'),
	email: Yup.string().min(1, 'Email is required').email('Invalid email format'),
});

const amoeSettingInitialValues = (details) => ({
	addressLine1: details?.addressLine1 ?? '',
	addressLine2: details?.addressLine2 ?? '',
	city: details?.city ?? '',
	state: details?.state ?? '',
	postalCode: details?.postalCode ?? '',
	country: details?.country ?? '',
	email: details?.email ?? '',
});

const staticFormFields = [
	{
		name: 'addressLine1',
		fieldType: 'textField',
		label: 'Address Line 1',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 pt-3',
		divClass: 'mb-5',
	},
	{
		name: 'addressLine2',
		fieldType: 'textField',
		label: 'Address Line 2',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 pt-3',
		divClass: 'mb-5',
	},
	{
		name: 'city',
		fieldType: 'textField',
		label: 'City',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 pt-3',
		divClass: 'mb-5',
	},
	{
		name: 'state',
		fieldType: 'textField',
		label: 'State',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 pt-3',
		divClass: 'mb-5',
	},
	{
		name: 'postalCode',
		fieldType: 'textField',
		label: 'Postal Code',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 pt-3',
		divClass: 'mb-5',
	},
	{
		name: 'country',
		fieldType: 'select',
		label: 'Country',
		placeholder: 'Country',
		optionList: COUNTRIES?.map(({ name, code }) => ({
			id: code,
			optionLabel: name,
			value: code,
		})),
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 pt-3',
		divClass: 'mb-5',
	},
	{
		name: 'email',
		fieldType: 'textField',
		label: 'Email',
		switchSizeClass: 'd-flex justify-content-between form-switch-md px-0 pt-3',
		divClass: 'mb-5',
	},
];

const STATUS = [
	{
		label: 'Approved',
		value: 'approved',
	},
	{
		label: 'Pending',
		value: 'pending',
	},
	{
		label: 'Rejected',
		value: 'rejected',
	},
];

export const STATUS_VALUE_LABEL = {
	approved: 'Approved',
	pending: 'Pending',
	rejected: 'Rejected',
};

const staticFiltersFields = () => [
	{
		name: 'status',
		fieldType: 'select',
		label: '',
		placeholder: 'Status',
		optionList: STATUS?.map(({ id, label, value }) => ({
			id,
			optionLabel: label,
			value,
		})),
	},
	{
		name: 'ranges',
		fieldType: 'dateRangeSelector',
		label: '',
		placeholder: 'Date Range',
	},
];

const filterValues = () => ({
	isActive: null,
	userId: '',
	fromDate: '',
	toDate: '',
});

const filterValidationSchema = () =>
	Yup.object({
		isActive: Yup.string().nullable(),
		userId: Yup.string().nullable(),
		fromDate: Yup.string().nullable(),
		toDate: Yup.string().nullable(),
	});

export {
	amoeSchema,
	amoeSettingInitialValues,
	staticFormFields,
	filterValidationSchema,
	filterValues,
	staticFiltersFields,
};
