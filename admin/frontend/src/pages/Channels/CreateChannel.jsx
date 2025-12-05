import React from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useCreateChannel from './hooks/useCreateChannel';
import StepFormTabs from '../../components/Common/StepFormTabs';

const CreateChannel = () => {
	const { tabData, activeTab } = useCreateChannel();

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Channel"
				breadcrumbItem="Create"
				titleLink="/chat/channels"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
			/>
			<Container fluid>
				<StepFormTabs
					activeTab={activeTab}
					dontShowFooter
					tabsData={tabData}
					// toggleTab={toggleTab}
					// onNextClick={}
					// submitButtonLoading={createChannelLoading}
				/>
			</Container>
		</div>
	);
};

CreateChannel.propTypes = {};

export default CreateChannel;
