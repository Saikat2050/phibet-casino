import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { IS_ACTIVE_TYPES } from '../CasinoTransactionsList/constants';

// Add staff and edit staff
const getInitialValues = (defaultValue) => ({
	email: defaultValue?.email || '',
	password: '',
	username: defaultValue?.username || '',
	firstName: defaultValue?.firstName || '',
	lastName: defaultValue?.lastName || '',
	role: defaultValue?.adminRole?.name || null,
	adminId: defaultValue?.parentAdminId || null,
	permission: defaultValue?.permission?.permission || {},
});
const initialValueInstance = {
	email: PropTypes.string,
	password: PropTypes.string,
	username: PropTypes.string,
	firstName: PropTypes.string,
	lastName: PropTypes.string,
	role: PropTypes.string,
	adminId: PropTypes.string,
	permission: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
};

const validationSchema = (isEdit) =>
	Yup.object({
		email: Yup.string()
			.email('Invalid email')
			.max(200)
			.required('Email Required'),
		password: !isEdit
			? Yup.string()
					.matches(
						/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
						'Password must include at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character (@$!%*?&), and be at least 8 characters long'
					)
					.min(8, 'Password must be at least 8 characters long')
					.max(50, 'Password cannot exceed 50 characters')
					.required('Password Required')
			: Yup.string().nullable(),
		firstName: Yup.string()
			.min(3, 'First Name must be atleast 3 characters')
			.max(200)
			.matches(
				/^[a-zA-Z\s]+(\s[a-zA-Z\s]+)?$/,
				'Only Alphabets and Space Allowed and Must Start with Alphabet'
			)
			.required('First Name Required'),
		lastName: Yup.string()
			.min(3, 'Last Name must be atleast 3 characters')
			.max(200)
			.matches(
				/^[a-zA-Z\s]+(\s[a-zA-Z\s]+)?$/,
				'Only Alphabets and Space Allowed and Must Start with Alphabet'
			)
			.required('Last Name Required'),
		role: Yup.string().required('Role Required'),
		// adminId: Yup.string().when('role', {
		// 	is: (role) => role === 'Support',
		// 	then: Yup.string().required('Parent Admin is required').nullable(),
		// 	otherwise: Yup.string().nullable(),
		// }),
		username: Yup.string()
			.matches(/^[A-Za-z0-9]+$/, 'Only Alphabets and Numbers Allowed')
			.min(8, 'Minimum 8 characters required')
			.max(100, 'Maximum 100 characters allowed')
			.required('User Name Required'),
		adminRoleId: Yup.number().required('Admin role id is required'),
		// group: Yup.string()
		//   .min(3, 'Group Name must be atleast 3 characters')
		//   .max(200)
		//   .matches(/^[A-Za-z0-9 ]+$/, 'Only Alphabets, Numbers and Space Allowed')
		//   .required('Group Name Required'),
	});

const leftStaticFormFields = (isEdit) => [
	{
		name: 'username',
		fieldType: 'textField',
		label: 'Username',
		placeholder: 'Enter username',
		isDisabled: isEdit,
		isRequired: true,
	},
	{
		name: 'firstName',
		fieldType: 'textField',
		label: 'First Name',
		placeholder: 'Enter first name',
		isRequired: true,
	},
];

const rightStaticFormFields = (isEdit) => [
	{
		name: 'email',
		fieldType: 'textField',
		label: 'Email',
		placeholder: 'Enter your email',
		isDisabled: isEdit,
		isRequired: true,
	},
	{
		name: 'lastName',
		fieldType: 'textField',
		label: 'Last Name',
		placeholder: 'Enter last name',
		isRequired: true,
	},
	{
		name: 'password',
		fieldType: 'password',
		label: 'Password',
		placeholder: 'Enter password',
		isPassword: true, // for showing visibility (if needed)
		isHide: isEdit,
		isRequired: true,
	},
];

// Staff Filter
const staticFiltersFields = () => [
	{
		name: 'isActive',
		fieldType: 'select',
		label: '',
		placeholder: 'Status',
		optionList: IS_ACTIVE_TYPES?.map(({ id, label, value }) => ({
			id,
			optionLabel: label,
			value,
		})),
	},
];

const filterValues = () => ({
	isActive: null,
	searchString: '',
});

const filterValidationSchema = () =>
	Yup.object({
		isActive: Yup.string().nullable(),
		searchString: Yup.string().nullable(),
	});

export {
	validationSchema,
	getInitialValues,
	leftStaticFormFields,
	rightStaticFormFields,
	staticFiltersFields,
	filterValues,
	filterValidationSchema,
	initialValueInstance,
};
