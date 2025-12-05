/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';

import {
	adminProfileSchema,
	getAdminInitialValues,
	leftStaticAdminFormFields,
	rightStaticAdminFormFields,
} from '../formDetails';

import FormPage from '../../../components/Common/FormPage';
import Spinners from '../../../components/Common/Spinner';

import useForm from '../../../components/Common/Hooks/useFormModal';

const Overview = ({
	details,
	isTenant,
	isEditable,
	setIsEditable,
	updateData,
	isLoading,
}) => {
	const handleSubmit = (values) => {
		updateData({
			...values,
			adminId: Number(details?.id),
			adminUserId: Number(details?.permissions?.[0]?.adminUserId),
		});
		setIsEditable((prev) => !prev);
	};

	const handleEdit = () => {
		setIsEditable((prev) => !prev);
	};

	const {
		leftFormFields,
		rightFormFields,
		setLeftFormFields,
		setRightFormFields,
		validation,
	} = useForm({
		initialValues: getAdminInitialValues(details),
		validationSchema: adminProfileSchema,
		onSubmitEntry: isEditable ? handleEdit : handleSubmit,
		leftStaticFormFields: leftStaticAdminFormFields(isEditable),
		rightStaticFormFields: rightStaticAdminFormFields(isEditable),
	});

	useEffect(() => {
		if (details) {
			setLeftFormFields(leftStaticAdminFormFields(isEditable));
			setRightFormFields(rightStaticAdminFormFields(isEditable));
		}
	}, [isEditable]);

	useEffect(() => {
		if (details) {
			validation.resetForm({
				values: {
					firstName: details?.firstName,
					lastName: details?.lastName,
					email: details?.email,
					username: details?.username || '',
					phone: isTenant ? details?.phone : '',
					role:
						details?.adminRole?.name === 'Superadmin'
							? 'Admin'
							: details?.adminRole?.name,
					agentName: details?.agentName || '',
					group: details?.group || '', // to be updated
				},
			});
		}
	}, [details]);

	return (
		<Row>
			<Col lg="12">
				{isLoading ? (
					<Spinners
						color="primary"
						className="position-absolute top-50 start-50"
					/>
				) : (
					<FormPage
						validation={validation}
						leftFormFields={leftFormFields}
						rightFormFields={rightFormFields}
						submitLabel="Submit"
						isSubmit={!isEditable}
						isEdit={isEditable}
						enableEdit={setIsEditable}
						customColClasses=""
						isSubmitLoading={isLoading}
					/>
				)}
			</Col>
		</Row>
	);
};

Overview.defaultProps = {};

export default Overview;
