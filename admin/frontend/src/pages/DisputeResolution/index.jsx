import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import DisputeDetails from './components/DisputeDetails';
import DisputeList from './components/DisputeList';
import useDisputeResolution from './hooks/useDisputeResolution';

const DisputeResolutionH = () => {
	const showBreadcrumb = useSelector((state) => state.Layout.showBreadcrumb);
	const {
		disputes,
		loading,
		selectedDispute,
		setSelectedDispute,
		detailsLoading,
		disputeDetails,
		sendMessageLoading,
		updateStatus,
		handleSendMessage,
		sendMessageSuccess,
		setPage,
		page,
		filters,
		setFilters,
	} = useDisputeResolution();

	return (
		<div className="page-content">
			<Container fluid>
				{showBreadcrumb && (
					<Breadcrumb title="CRM" breadcrumbItem="Dispute Resolution" />
				)}
				<Row>
					<Col lg="12">
						<div className="d-lg-flex">
							<DisputeList
								disputes={disputes}
								loading={loading}
								selectedDispute={selectedDispute}
								setSelectedDispute={setSelectedDispute}
								setPage={setPage}
								page={page}
								filters={filters}
								setFilters={setFilters}
							/>
							<DisputeDetails
								detailsLoading={detailsLoading}
								disputeDetails={disputeDetails}
								updateStatus={updateStatus}
								sendMessageLoading={sendMessageLoading}
								handleSendMessage={handleSendMessage}
								sendMessageSuccess={sendMessageSuccess}
							/>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default DisputeResolutionH;
