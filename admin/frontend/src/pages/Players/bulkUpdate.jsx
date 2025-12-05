import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useBulkUpdate from './hooks/useBulkUpdate';
import FormPage from '../../components/Common/FormPage';

const BulkUpdate = () => {
	const {
		validation,
		leftFormFields,
		rightFormFields,
		customComponent,
		notifyPlayerLoading,
	} = useBulkUpdate();

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="Players"
					breadcrumbItem="Attach Tag"
					leftTitle={
						<>
							<i className="fas fa-angle-left" /> Back
						</>
					}
					values={validation.values}
					isNotFormModal
				/>
				<Row>
					<Col lg="12">
						<FormPage
							formTitle="Attach Tag"
							validation={validation}
							leftFormFields={leftFormFields}
							rightFormFields={rightFormFields}
							customComponent={customComponent}
							submitLabel="Attach Tag"
							customColClasses=""
							isSubmitLoading={notifyPlayerLoading}
							rowCustomClass="px-4"
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default BulkUpdate;
