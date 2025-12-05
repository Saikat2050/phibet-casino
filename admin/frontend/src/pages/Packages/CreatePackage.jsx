import React from 'react';
import { Container } from 'reactstrap';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormPage from '../../components/Common/FormPage';
import useCreate from './hooks/useCreatePackage';
import { projectName } from '../../constants/config';

const CreatePackage = () => {
	document.title = projectName;
	const { validation, formFields, createPackageLoading } = useCreate();

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
					formTitle="Add New Package"
					validation={validation}
					responsiveFormFields={formFields}
					submitLabel="Create"
					colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
					customColClasses=""
					isSubmitLoading={createPackageLoading}
				/>
			</Container>
		</div>
	);
};

CreatePackage.propTypes = {
	// t: PropTypes.func.isRequired,
};

export default CreatePackage;
