/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Buffer } from 'buffer';
import FormModal from '../../../components/Common/FormModal';
import { passwordValidation } from '../formDetails';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { updateUserPassword } from '../../../store/actions';

const staticFormFields = (passwordShow, setPasswordShow) => {
	const { password, confirmPassword } = passwordShow;
	return [
		{
			name: 'password',
			fieldType: 'password',
			label: 'Password',
			type: password ? 'text' : 'password',
			placeholder: 'Enter Password',
			required: true,
			icon: password ? (
				<i className="mdi mdi-eye-outline" />
			) : (
				<i className="mdi mdi-eye-off-outline" />
			),
			callBack: () => {
				setPasswordShow((prev) => ({
					...prev,
					password: !prev.password,
				}));
			},
		},
		{
			name: 'confirmPassword',
			fieldType: 'password',
			label: 'Confirm Password',
			type: confirmPassword ? 'text' : 'password',
			placeholder: 'Enter Confirm Password',
			required: true,
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

const ResetUserPassword = ({ show, headerText, toggle }) => {
	const dispatch = useDispatch();

	const [passwordShow, setPasswordShow] = useState({
		password: false,
		confirmPassword: false,
	});

	const { playerId } = useParams();
	const { updateUserPasswordLoading } = useSelector(
		(state) => state.UserDetails
	);
	const handleResetUserPassword = (formValues) => {
		const encryptedPass = Buffer.from(formValues.password).toString('base64');
		dispatch(
			updateUserPassword({
				newPassword: encryptedPass,
				userId: parseInt(playerId, 10),
			})
		);
	};

	const { isOpen, setIsOpen, header, validation, formFields, setFormFields } =
		useForm({
			header: headerText,
			validationSchema: passwordValidation,
			initialValues: {
				password: '',
				confirmPassword: '',
			},
			onSubmitEntry: (values, { resetForm }) => {
				handleResetUserPassword(values);
				resetForm();
				toggle();
			},
			staticFormFields: staticFormFields(passwordShow, setPasswordShow),
		});

	useEffect(() => {
		if (show) setIsOpen(true);
		else setIsOpen(false);
	}, [show]);

	useEffect(() => {
		setFormFields(staticFormFields(passwordShow, setPasswordShow));
	}, [passwordShow]);

	return (
		<div>
			<FormModal
				isOpen={isOpen}
				toggle={() => {
					setIsOpen((prev) => !prev);
					toggle();
				}}
				header={header}
				validation={validation}
				formFields={formFields}
				submitLabel="Submit"
				customColClasses="col-md-12"
				isSubmitLoading={updateUserPasswordLoading}
			/>
		</div>
	);
};

export default ResetUserPassword;
