import * as Yup from 'yup';
import React from 'react';

const adminProfileSchema = Yup.object().shape({
	firstName: Yup.string()
		.min(3, 'First Name must be atleast 3 characters')
		.max(200)
		.matches(
			/^[a-zA-Z]+(\s[a-zA-Z]+)?$/,
			'Only Alphabets and Space Allowed and Must Start with Alphabet'
		)
		.required('First Name Required'),
	lastName: Yup.string()
		.min(3, 'Last Name must be atleast 3 characters')
		.max(200)
		.matches(
			/^[a-zA-Z]+(\s[a-zA-Z]+)?$/,
			'Only Alphabets and Space Allowed and Must Start with Alphabet'
		)
		.required('Last Name Required'),
	phone: Yup.string()
		.min(10, 'Phone must be at least 10 digits')
		.max(20, 'Phone must be at most 20 digits')
		.matches(
			/^((\\+[1-9]{1,10}[ \\-]*)|(\\([0-9]{1,10}\\)[ \\-]*)|([0-9]{1,10})[ \\-]*)*?[0-9]{1,10}?[ \\-]*[0-9]{1,10}?$/,
			'Enter a valid Phone Number'
		),
});

const profilePasswordSchema = Yup.object().shape({
	password: Yup.string()
		.required('Old Password Required!')
		.min(8, 'Password must be at least 8 characters long')
		.max(50, 'Password cannot exceed 50 characters')
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			'Password must include at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character (@$!%*?&), and be at least 8 characters long'
		),
	newPassword: Yup.string()
		.min(8, 'New Password must be at least 8 characters long')
		.max(50, 'New Password cannot exceed 50 characters')
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			'New Password must include at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character (@$!%*?&), and be at least 8 characters long'
		)
		.test(
			'match',
			'Old and New Password Must be Different!',
			function (newPassword) {
				return newPassword !== this.options.parent.password;
			}
		)
		.required('New Password Required!'),
	confirmPassword: Yup.string()
		.min(8, 'Confirm Password must be at least 8 characters long')
		.max(50, 'Confirm Password cannot exceed 50 characters')
		.oneOf([Yup.ref('newPassword'), null], 'Passwords must match!')
		.required('Confirm Password Required!'),
});

const getAdminInitialValues = (details, isTenant) => ({
	firstName: details?.firstName,
	lastName: details?.lastName,
	email: details?.email,
	username: details?.username || '',
	phone: isTenant ? details?.phone : '',
	role:
		details?.adminRole?.name === 'Superadmin'
			? 'Admin'
			: details?.SuperadminRole?.name,
	agentName: details?.agentName || '',
	group: details?.group || '',
});

const getPasswordInitialValues = () => ({
	password: '',
	newPassword: '',
	confirmPassword: '',
});

const leftStaticAdminFormFields = (isEditable) => [
	{
		name: 'firstName',
		fieldType: 'textField',
		label: 'First Name',
		isDisabled: isEditable,
		placeholder: 'Enter First Name',
	},
	{
		name: 'email',
		fieldType: 'textField',
		label: 'Email',
		isDisabled: true,
		placeholder: 'Enter Email',
	},
	{
		name: 'role',
		fieldType: 'textField',
		label: 'Role',
		isDisabled: true,
		placeholder: 'Enter Role',
	},
];

const rightStaticAdminFormFields = (isEditable) => [
	{
		name: 'lastName',
		fieldType: 'textField',
		label: 'Last Name',
		isDisabled: isEditable,
		placeholder: 'Enter Last Name',
	},
	{
		name: 'username',
		fieldType: 'textField',
		label: 'User Name',
		isDisabled: true,
		placeholder: 'Enter User Name',
	},
];

const staticPasswordFormFields = (passwordShow, setPasswordShow) => {
	const { oldPassword, newPassword, confirmPassword } = passwordShow;
	return [
		{
			name: 'password',
			fieldType: 'password',
			type: oldPassword ? 'text' : 'password',
			label: 'OLD PASSWORD',
			icon: oldPassword ? (
				<i className="mdi mdi-eye-outline" />
			) : (
				<i className="mdi mdi-eye-off-outline" />
			),
			callBack: () =>
				setPasswordShow((prev) => ({
					...prev,
					oldPassword: !prev.oldPassword,
				})),
		},
		{
			name: 'newPassword',
			fieldType: 'password',
			type: newPassword ? 'text' : 'password',
			label: 'NEW PASSWORD',
			icon: newPassword ? (
				<i className="mdi mdi-eye-outline" />
			) : (
				<i className="mdi mdi-eye-off-outline" />
			),
			callBack: () =>
				setPasswordShow((prev) => ({
					...prev,
					newPassword: !prev.newPassword,
				})),
		},
		{
			name: 'confirmPassword',
			fieldType: 'password',
			type: confirmPassword ? 'text' : 'password',
			label: 'CONFIRM PASSWORD',
			icon: confirmPassword ? (
				<i className="mdi mdi-eye-outline" />
			) : (
				<i className="mdi mdi-eye-off-outline" />
			),
			callBack: () =>
				setPasswordShow((prev) => ({
					...prev,
					confirmPassword: !prev.confirmPassword,
				})),
		},
	];
};

export {
	adminProfileSchema,
	profilePasswordSchema,
	leftStaticAdminFormFields,
	rightStaticAdminFormFields,
	getAdminInitialValues,
	getPasswordInitialValues,
	staticPasswordFormFields,
};
