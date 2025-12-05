import React from 'react';
import { Container } from 'reactstrap';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormPage from '../../components/Common/FormPage';
import useUpdateVIPTier from './hooks/useUpdateVIPTier';
// import { projectName } from '../../constants/config';

const UpdateVip = () => {
	// document.title = projectName;
	// const { validation, formFields, createPackageLoading } = useCreate();
	const { vipTiersLoading, validation, formFields } = useUpdateVIPTier();

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
					formTitle="Edit VIP Level"
					validation={validation}
					responsiveFormFields={formFields}
					submitLabel="Update"
					colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
					customColClasses=""
					isSubmitLoading={vipTiersLoading}
				/>
			</Container>
		</div>
	);
};

UpdateVip.propTypes = {
	// t: PropTypes.func.isRequired,
};

export default UpdateVip;
