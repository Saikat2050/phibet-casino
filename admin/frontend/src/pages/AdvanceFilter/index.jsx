import React from 'react';
import { Card, Col, Container, Row } from 'reactstrap';
import { useSelector } from 'react-redux';
import Breadcrumb from '../../components/Common/Breadcrumb';
import CrudSection from '../../components/Common/CrudSection';
import AdvanceFilterForm from './AdvanceFilterForm';

const AdvanceFilter = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="Advance Filter" breadcrumbItem="Advance Filter" />
				)}
				<Container fluid>
					<Row>
						<Col lg="12">
							<Card>
								<CrudSection title="" />
								<AdvanceFilterForm />
							</Card>
						</Col>
					</Row>
				</Container>
			</Container>
		</div>
	);
};

export default AdvanceFilter;
