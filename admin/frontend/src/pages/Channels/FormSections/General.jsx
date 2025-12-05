/* eslint-disable react/prop-types */
/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	generalStaticFormFields,
	generalStepInitialValues,
} from '../formDetails';
import FormPage from '../../../components/Common/FormPage';
import useForm from '../../../components/Common/Hooks/useFormModal';
import { channelCriteria } from '../constants';
import { generalFormSchema } from '../Validation/schema';
import { createChannel } from '../../../store/actions';

const General = ({ channelDetails }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleSubmit = (values) => {
		const criteria = [];
		channelCriteria.map((item) => {
			if (values[item.name] === true) {
				criteria.push({
					key: item.value,
					value:
						item.valueContent === 'kycValue'
							? true
							: Number(values[item.valueContent]),
				});
			}
		});

		dispatch(
			createChannel({
				data: {
					name: values.name,
					description: values.description,
					status: values.isActive,
					groupLogo: null,
					criteria,
					isGlobal: values.isGlobal,
				},
				navigate,
			})
		);
	};

	const { formFields, setFormFields, validation } = useForm({
		initialValues: generalStepInitialValues({ channelDetails }),
		validationSchema: generalFormSchema(),
		onSubmitEntry: handleSubmit,
		staticFormFields: generalStaticFormFields,
	});

	useEffect(() => {
		let myFormField = formFields;

		if (
			validation?.values?.tierToggle === true &&
			formFields.findIndex((item) => item.name === 'tierValue') === -1
		) {
			myFormField = [
				...myFormField,
				{
					name: 'tierValue',
					fieldType: 'textField',
					placeholder: 'Enter Tier Level Limit',
					label: 'Tier Level',
					type: '',
					isNewRow: true,
				},
			];
		}
		if (validation?.values?.tierToggle === false) {
			myFormField = myFormField.filter((item) => item.name !== 'tierValue');
		}
		if (
			validation?.values?.wageringToggle === true &&
			formFields.findIndex((item) => item.name === 'wageringValue') === -1
		) {
			myFormField = [
				...myFormField,
				{
					name: 'wageringValue',
					fieldType: 'textField',
					placeholder: 'Enter Wagering Limit',
					label: 'Wagering Limit',
					type: '',
					isNewRow: true,
				},
			];
		}
		if (
			validation?.values?.timeToggle === true &&
			formFields.findIndex((item) => item.name === 'timeValue') === -1
		) {
			myFormField = [
				...myFormField,
				{
					name: 'timeValue',
					fieldType: 'textField',
					placeholder: 'Enter Time Duration',
					label: 'Time Duration',
					type: '',
					isNewRow: true,
				},
			];
		}
		if (validation?.values?.wageringToggle === false) {
			myFormField = myFormField.filter((item) => item.name !== 'wageringValue');
		}
		if (validation?.values?.timeToggle === false) {
			myFormField = myFormField.filter((item) => item.name !== 'timeValue');
		}
		setFormFields(myFormField);
	}, [
		validation?.values?.wageringToggle,
		validation?.values?.tierToggle,
		validation?.values?.timeToggle,
	]);

	return (
		<Row>
			<Col lg="12">
				<FormPage
					validation={validation}
					responsiveFormFields={formFields}
					customColClasses=""
					colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
					isSubmit
				/>
			</Col>
		</Row>
	);
};

General.defaultProps = {};

export default General;
