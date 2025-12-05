import * as Yup from 'yup';
import moment from 'moment';
import { STATUS_TYPE } from '../TransactionBankingList/constants';
import {
	LEDGER_PURPOSE,
	LEDGER_TYPES,
	bonusStatus,
	bonusTypes,
} from './constants';

const getInitialValues = (defaultValue) => ({
	title: defaultValue?.title || '',
	comment: defaultValue?.comment || '',
});

const validationSchema = () =>
	Yup.object().shape({
		title: Yup.string()
			.required('Title Required')
			.max(50, 'Maximum 50 Characters Allowed')
			.min(3, 'Minimum 3 Characters Required'),
		comment: Yup.string()
			.required('Note Required')
			.max(200, 'Maximum 200 Characters Allowed')
			.min(3, 'Minimum 3 Characters Required'),
	});

const staticFormFields = [
	{
		name: 'title',
		fieldType: 'textField',
		label: 'Title',
		required: true,
		placeholder: 'Enter the Title',
		maximum: 51,
		isRequired: true,
	},
	{
		name: 'comment',
		fieldType: 'textField',
		label: 'Note',
		required: true,
		placeholder: 'Enter Note',
		maximum: 201,
		isRequired: true,
	},
];

const limitsSchema = ({ minimum, maximum = 1000000, currLabel, label }) =>
	Yup.object().shape({
		limit: Yup.number()
			.positive('Limit must be a positive number')
			.integer('Limit must be an integer')
			.min(
				parseInt(minimum, 10) + 1,
				`${currLabel} Must Be Greater Than ${label} (${minimum})`
			)
			.max(
				parseInt(maximum, 10),
				`${currLabel} must be less than or equal to (${maximum})`
			)
			.required('Limit Required'),
	});

const setDisableUserlimitsSchema = () =>
	Yup.object().shape({
		limit: Yup.number()
			.positive('Time Period must be positive number')
			.integer('Time Period must be an integer')
			.required('Time Period Required'),
	});
const maxValue = 2000;
const selfExclusionSchema = () =>
	Yup.object().shape({
		permanent: Yup.string().required('Please select a time period'),
		days: Yup.number()
			.min(1, 'Days must be at least 1.')
			.max(maxValue, `Days must be at most ${maxValue}.`)
			.positive('Days must be a positive number.')
			.integer('Days must be an integer.'),
	});

const getLimitInitialValues = (defaultValue) => ({
	limit: defaultValue?.limit || '',
});

const depositSchema = () =>
	Yup.object().shape({
		// amountType: Yup.string().required('Amount type is required!'),
		addAmount: Yup.number()
			.typeError('Only numbers are allowed')
			.min(0.01, 'Amount should be greater than 0')
			.required('Amount Required!'),
		transactionType: Yup.string().required('Transaction type required!'),
		currencyId: Yup.string().required('Currency is required!'),
	});

const userSchema = () =>
	Yup.object().shape({
		email: Yup.string()
			.email('Invalid Email')
			.max(50)
			.required('Email Required'),
		firstName: Yup.string()
			.min(3, 'Minimum 3 Characters Required')
			.max(50, 'Maximum 50 Characters Allowed')
			.required('First Name Required'),
		lastName: Yup.string()
			.min(3, 'Minimum 3 Characters Required')
			.max(50, 'Maximum 50 Characters Allowed')
			.required('Last Name Required'),
		phone: Yup.string()
			.required('Phone Number Required')
			.min(7, 'Invalid phone number, must be at least 7 digits')
			.max(15, 'Invalid phone number, must be at most 15 digits'),
		dateOfBirth: Yup.string()
			.test('is-21', 'Must Be 21 Years Old', (dob) => {
				if (!dob) return false;
				return moment().diff(moment(dob, 'YYYY-MM-DD'), 'years') >= 21;
			})
			.required('DOB Required'),
		gender: Yup.string().required('Gender Required'),
		username: Yup.string()
			.max(20, 'Maximum 20 Characters Allowed')
			.min(3, 'Minimum 3 Characters Required')
			.required('User Name Required'),
		address1: Yup.string()
			.max(100, 'Maximum 100 Characters Allowed')
			.matches(
				/^[a-zA-Z0-9\s,.'-]{3,}$/,
				"Address can only contain letters, numbers, spaces, and the following characters: , . ' -"
			)
			.required('Address 1 Required'),
		address2: Yup.string()
			.max(100, 'Maximum 100 Characters Allowed')
			.nullable(),
		// .matches(
		// 	/^[a-zA-Z0-9\s,.'-]{3,}$/,
		// 	"Address can only contain letters, numbers, spaces, and the following characters: , . ' -"
		// ),
		city: Yup.string()
			.max(50, 'City cannot exceed 25 characters.')
			.min(3, 'City must be at least 3 characters long.')
			.matches(/^[A-Za-z\s]+$/, 'City name can only contain letters')
			.required('City Required'),
		zipCode: Yup.string()
			.matches(
				/^\d{5}(-\d{4})?$/,
				'Invalid ZIP Code format. Must be 5 digits or 5 digits followed by a hyphen and 4 more digits.'
			)
			.required('Zip Code Required'),
		// currencyCode: Yup.string(),
		stateCode: Yup.string()?.required('State Required'),
		// ssn: Yup.number()
		// 	.required('SSN Required')
		// 	.test('len', 'SSN must be exactly 9 digits', (value) => {
		// 		if (!value) return false;
		// 		return value.toString().length === 9;
		// 	}),
	});

const getInitialValuesUpdateUser = (defaultValue) => {
	const address = defaultValue?.addresses?.[0];
	return {
		userId: defaultValue?.id,
		firstName: defaultValue?.firstName,
		lastName: defaultValue?.lastName,
		username: defaultValue?.username,
		email: defaultValue?.email,
		stateCode: address?.stateCode || null,
		address1: address?.address1,
		address2: address?.address2,
		city: address?.city,
		zipCode: address?.zipCode,
		dateOfBirth: defaultValue?.dateOfBirth,
		gender: defaultValue?.gender,
		currencyCode: defaultValue?.currencyCode,
		phoneCode: defaultValue?.phoneCode || '',
		phone: defaultValue?.phone || '',
		preferredLanguage: defaultValue?.preferredLanguage || '',
		newsLetter: defaultValue?.newsLetter || false,
		sms: defaultValue?.sms || false,
		// ssn: defaultValue?.ssn || '',
	};
};

const passwordValidation = () =>
	Yup.object().shape({
		password: Yup.string()
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				'Password must include at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character (@$!%*?&), and be at least 8 characters long'
			)
			.min(8, 'Password must be at least 8 characters long')
			.max(50, 'Password cannot exceed 50 characters')
			.required('Password Required'),
		confirmPassword: Yup.string()
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				'Password must include at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character (@$!%*?&), and be at least 8 characters long'
			)
			.min(8, 'Confirm Password must be at least 8 characters long')
			.max(50, 'Confirm Password cannot exceed 50 characters')
			.required('Password Required')
			.test(
				'isEqual',
				'Confirm Password should be same as Password',
				(value, testContext) => {
					if (testContext.parent.password !== value) return false;
					return true;
				}
			),
	});

// Bet History filters
const staticFiltersFields = () => [
	// {
	// 	name: 'gameId',
	// 	fieldType: 'textField',
	// 	placeholder: 'Search by gameId',
	// 	type: 'search',
	// },
	{
		name: 'walletId',
		fieldType: 'textField',
		placeholder: 'Search by walletId',
		type: 'search',
	},
	// {
	// 	name: 'actioneeId',
	// 	fieldType: 'textField',
	// 	placeholder: 'Search by actioneeId',
	// 	type: 'search',
	// },
	{
		name: 'transactionId',
		fieldType: 'textField',
		placeholder: 'Search by transactionId',
		type: 'search',
	},
	{
		name: 'conversionRate',
		fieldType: 'textField',
		placeholder: 'Search by conversionRate',
		type: 'search',
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

const filterValues = () => ({
	fromDate: '',
	toDate: '',
	// gameId: '',
	walletId: '',
	// actioneeId: '',
	transactionId: '',
	conversionRate: '',
	// previousTransactionId: '',
	// transactionType: null,
	status: null,
});

const filterValidationSchema = () =>
	Yup.object({
		status: Yup.string().nullable(),
		fromDate: Yup.string().nullable(),
		toDate: Yup.string().nullable(),
		transactionType: Yup.string().nullable(),
		gameId: Yup.string().nullable(),
		walletId: Yup.string().nullable(),
		actioneeId: Yup.string().nullable(),
		transactionId: Yup.string().nullable(),
		conversionRate: Yup.string().nullable(),
		previousTransactionId: Yup.string().nullable(),
	});
// Transaction filters

const transactionFiltersFields = () => [
	{
		name: 'type',
		fieldType: 'select',
		label: '',
		placeholder: 'Ledger type',
		optionList: LEDGER_TYPES.map(({ value, label }) => ({
			id: value,
			value,
			optionLabel: label,
		})),
	},
	{
		name: 'purpose',
		fieldType: 'select',
		label: '',
		placeholder: 'Ledger Purpose',
		optionList: LEDGER_PURPOSE.map(({ value, label }) => ({
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

const transactionFilterValues = () => ({
	fromDate: null,
	toDate: null,
	currencyCode: null,
	type: null,
	purpose: null,
});

const transactionFilterValidationSchema = () =>
	Yup.object({
		fromDate: Yup.string().nullable(),
		toDate: Yup.string().nullable(),
		currencyCode: Yup.string().nullable(),
		type: Yup.string().nullable(),
		purpose: Yup.string().nullable(),
	});

// Bonus filters

const bonusFiltersFields = () => [
	{
		name: 'bonusType',
		fieldType: 'select',
		label: '',
		placeholder: 'Bonus type',
		optionList: bonusTypes.map(({ value, label }) => ({
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
		optionList: bonusStatus.map(({ value, label }) => ({
			id: value,
			value,
			optionLabel: label,
		})),
	},
];

const bonusFilterValues = () => ({
	bonusType: null,
	status: null,
});

const bonusFilterValidationSchema = () =>
	Yup.object({
		bonusType: Yup.string().nullable(),
		status: Yup.string().nullable(),
	});

// Comments filter
// search: anil
// userId: 72
// role: admin
// status: false
const commentsFiltersFields = () => [
	{
		name: 'searchString',
		fieldType: 'textField',
		type: 'search',
		label: '',
		placeholder: 'Search by Title, Description or Agent',
	},
	{
		name: 'role',
		fieldType: 'select',
		label: '',
		placeholder: 'Select Role',
		optionList: [
			{
				value: 'admin',
				optionLabel: 'Admin',
			},
		],
	},
	{
		name: 'status',
		fieldType: 'select',
		label: '',
		placeholder: 'Status',
		optionList: [
			{
				value: true,
				optionLabel: 'Active',
			},
			{
				value: false,
				optionLabel: 'Resolved',
			},
		],
	},
];

const commentsFilterValues = () => ({
	searchString: '',
	role: null,
	status: null,
});

const commentsFilterValidationSchema = () =>
	Yup.object({
		searchString: Yup.string().nullable(),
		role: Yup.string().nullable(),
		status: Yup.string().nullable(),
	});

export {
	validationSchema,
	getInitialValues,
	staticFormFields,
	limitsSchema,
	selfExclusionSchema,
	getLimitInitialValues,
	setDisableUserlimitsSchema,
	depositSchema,
	userSchema,
	getInitialValuesUpdateUser,
	passwordValidation,
	staticFiltersFields,
	filterValidationSchema,
	filterValues,
	transactionFiltersFields,
	transactionFilterValues,
	transactionFilterValidationSchema,
	bonusFiltersFields,
	bonusFilterValues,
	bonusFilterValidationSchema,
	commentsFilterValidationSchema,
	commentsFilterValues,
	commentsFiltersFields,
};
