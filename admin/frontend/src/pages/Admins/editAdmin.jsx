/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormPage from '../../components/Common/FormPage';
import { getInitialValues } from './formDetails';
import { STORAGE_KEY } from '../../components/Common/constants';
import { decryptCredentials } from '../../network/storageUtils';
import useEdit from './hooks/useEdit';

const EditAdmin = () => {
	const navigate = useNavigate();
	const [adminData, setAdminData] = useState({});
	const { adminUserId } = useParams();

	const {
		validation,
		customComponent,
		leftFormFields,
		rightFormFields,
		isUpdateSuperUserLoading,
	} = useEdit(adminData);

	useEffect(() => {
		const savedDetails = decryptCredentials(
			localStorage.getItem(`${STORAGE_KEY.ADMIN_EDIT}_${adminUserId}`)
		);
		if (savedDetails) {
			let data = JSON.parse(savedDetails);
			data = {
				...data,
				permission: {
					...data.permission,
					permission: data?.permission?.permission
						? typeof data?.permission?.permission === 'string'
							? JSON.parse(data?.permission?.permission)
							: data.permission.permission
						: {},
				},
			};
			setAdminData(data);
			validation.resetForm(getInitialValues(data));
		} else {
			navigate('/staff');
		}

		return () =>
			localStorage.removeItem(`${STORAGE_KEY.ADMIN_EDIT}_${adminUserId}`);
	}, []);

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Staff"
				breadcrumbItem="Edit"
				titleLink="/staff"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
			/>
			<Container fluid>
				<FormPage
					formTitle="Edit staff"
					validation={validation}
					leftFormFields={leftFormFields}
					rightFormFields={rightFormFields}
					submitLabel="Submit"
					customColClasses=""
					customComponent={customComponent}
					isSubmitLoading={isUpdateSuperUserLoading}
				/>
			</Container>
		</div>
	);
};

EditAdmin.propTypes = {
	// t: PropTypes.func.isRequired,
};

export default EditAdmin;
