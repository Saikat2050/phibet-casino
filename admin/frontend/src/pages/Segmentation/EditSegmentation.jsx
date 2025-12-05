import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import { projectName } from '../../constants/config';
import SegmentationForm from './SegmentationForm';

const EditSegmentation = () => {
	document.title = projectName;
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title="Segmentation"
					breadcrumbItem="Edit"
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
							<CrudSection title="Edit Segmentation" />
							<div className="mt-2 p-3">
								<SegmentationForm isEdit />
							</div>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default EditSegmentation;
