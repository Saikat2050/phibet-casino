import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { projectName } from '../../constants/config';
import useCmsDetail from './hooks/useCmsDetails';
import FormPage from '../../components/Common/FormPage';
import { CustomComponent } from './CmsListCol';

const CMSDetails = () => {
	// Set meta title
	document.title = projectName;

	const { header, validation, formFields, languageOptions } = useCmsDetail();

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="CMS"
					breadcrumbItem="View"
					titleLink="/cms"
					leftTitle={
						<>
							<i className="fas fa-angle-left" /> Back
						</>
					}
				/>
				<Row>
					<Col lg="12">
						<Card key={validation?.values?.language}>
							<FormPage
								formTitle={header}
								validation={validation}
								responsiveFormFields={formFields}
								customComponent={
									<CustomComponent
										validation={validation}
										languages={languageOptions}
										isView
									/>
								}
								submitLabel="Submit"
								customColClasses=""
								isSubmitLoading={false}
								isSubmit={false}
							/>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default CMSDetails;
