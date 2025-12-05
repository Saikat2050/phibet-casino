import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { projectName } from '../../constants/config';
import useCreateWageringTemplate from './hooks/useCreateWagringTemplate';
import FormPage from '../../components/Common/FormPage';
import ConfirmationModal from '../../components/Common/ConfirmationModal';
import { formPageTitle } from '../../components/Common/constants';

const CreateWageringTemplate = () => {
	// Set meta title
	document.title = projectName;

	const {
		validation,
		formFields,
		customComponent,
		createWageringTemplateDetailLoading,
		showModal,
		setShowModal,
		navigate,
		existingFilledData,
	} = useCreateWageringTemplate();

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="Wagering Template"
					breadcrumbItem="Create"
					leftTitle={
						<>
							<i className="fas fa-angle-left" /> Back
						</>
					}
					values={validation.values}
					setShowModal={setShowModal}
				/>
				<Row>
					<Col lg="12">
						<FormPage
							formTitle="Create Wagering Template"
							validation={validation}
							responsiveFormFields={formFields}
							customComponent={customComponent}
							submitLabel="Submit"
							customColClasses=""
							isSubmitLoading={createWageringTemplateDetailLoading}
							colOptions={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 }}
						/>
						<ConfirmationModal
							openModal={showModal}
							setOpenModal={setShowModal}
							navigate={navigate}
							validation={existingFilledData}
							pageType={formPageTitle.wageringTemplate}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default CreateWageringTemplate;
