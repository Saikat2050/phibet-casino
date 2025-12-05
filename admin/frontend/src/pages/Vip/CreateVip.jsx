import React from 'react';
import { Container } from 'reactstrap';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormPage from '../../components/Common/FormPage';
// import useCreate from './hooks/useCreatePackage';
import useCreateVIPTier from './hooks/useCreateVIPTier';
// import { projectName } from '../../constants/config';

const CreateVip = () => {
	// document.title = projectName;
	// const { validation, formFields, createPackageLoading } = useCreate();
	const { validation, formFields } = useCreateVIPTier();

	return (
		<div className="page-content">
			<Breadcrumbs
				title="VIP"
				breadcrumbItem="Back"
				showBackButton
				titleLink="/vip"
			/>
			<Container fluid>
				<FormPage
					formTitle="Add New VIP Level"
					validation={validation}
					responsiveFormFields={formFields}
					submitLabel="Submit"
					colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
					customColClasses=""
					// isSubmitLoading={createPackageLoading}
				/>
			</Container>
		</div>
	);
};

CreateVip.propTypes = {
	// t: PropTypes.func.isRequired,
};

export default CreateVip;
