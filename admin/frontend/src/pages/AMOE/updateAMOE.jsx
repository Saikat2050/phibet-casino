import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import FormPage from '../../components/Common/FormPage';
import useUpdateSettings from './hooks/useUpdateSettings';

const CreateEmailTemplate = () => {
	const { validation, isEditAmoeLoading, formFields } = useUpdateSettings();

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="AMOE Settings"
					breadcrumbItem="Update"
					titleLink="/amoe"
					leftTitle={
						<>
							<i className="fas fa-angle-left" /> Back
						</>
					}
				/>
				<Row>
					<Col lg="12">
						<Card key={`content[${validation?.values?.language}]`}>
							<CrudSection buttonList={[]} title="Update AMOE Settings" />
							<FormPage
								validation={validation}
								isSubmitLoading={isEditAmoeLoading}
								responsiveFormFields={formFields}
								submitLabel="Submit"
								customColClasses=""
								formClass="ms-2"
							/>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default CreateEmailTemplate;
