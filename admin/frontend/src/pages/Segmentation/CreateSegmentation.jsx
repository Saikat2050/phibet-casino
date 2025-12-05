import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import { projectName } from '../../constants/config';
import SegmentationForm from './SegmentationForm';

const CreateSegmentation = () => {
	// Set meta title
	document.title = projectName;

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="Segmentation"
					breadcrumbItem="Create"
					titleLink="/segmentation"
					leftTitle={
						<>
							<i className="fas fa-angle-left" /> Back
						</>
					}
				/>
				<Row>
					<Col lg="12">
						<Card>
							<CrudSection title="Create Segmentation" />
							<SegmentationForm isEdit={false} />
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default CreateSegmentation;
