import React from 'react';
import { Container } from 'reactstrap';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormPage from '../../components/Common/FormPage';
import useUpdate from './hooks/useUpdatePackage';
import { projectName } from '../../constants/config';

const UpdatePackage = () => {
	document.title = projectName;
	const { validation, formFields, updatePackageLoading } = useUpdate();

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Package"
				breadcrumbItem="Back"
				showBackButton
				titleLink="/packages"
			/>
			<Container fluid>
				<FormPage
					formTitle="Update Package"
					validation={validation}
					responsiveFormFields={formFields}
					submitLabel="Submit"
					colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
					customColClasses=""
					isSubmitLoading={updatePackageLoading}
				/>
			</Container>
		</div>
	);
};

export default UpdatePackage;
