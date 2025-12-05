/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import useForm from '../../../components/Common/Hooks/useFormModal';
import FormModal from '../../../components/Common/FormModal';
import { userDisableReasons } from '../constants';

const reasonSchema = () =>
	Yup.object().shape({
		reason: Yup.string()
			.max(100, 'Max 100 characters')
			.required('Reason Required'),
	});

const staticFormFields = [
	{
		name: 'reason',
		fieldType: 'select',
		label: 'Reason',
		placeholder: 'Select Reason',
		optionList: userDisableReasons?.map((reason) => ({
			value: reason,
			optionLabel: reason,
		})),
	},
	{
		name: 'description',
		fieldType: 'textField',
		label: 'Description',
		required: false,
	},
];

const DisableReason = ({ show, handleClose, markUserStatusInactive, name }) => {
	const { updateSAUserStatusLoading } = useSelector(
		(state) => state.UserDetails
	);

	const { isOpen, setIsOpen, header, validation, formFields } = useForm({
		header: `Mark ${name || 'Player'} Inactive`,
		validationSchema: reasonSchema,
		initialValues: {
			reason: null,
			description: '',
		},
		onSubmitEntry: (values, { resetForm }) => {
			markUserStatusInactive(values);
			resetForm();
			handleClose();
		},
		staticFormFields,
	});

	useEffect(() => {
		if (show) setIsOpen(true);
		else setIsOpen(false);
	}, [show]);

	return (
		<div>
			<FormModal
				isOpen={isOpen}
				toggle={() => {
					setIsOpen((prev) => !prev);
					handleClose();
				}}
				header={header}
				validation={validation}
				formFields={formFields}
				submitLabel="Submit"
				customColClasses="col-md-12"
				isSubmitLoading={updateSAUserStatusLoading}
			/>
		</div>
	);
};

export default DisableReason;
