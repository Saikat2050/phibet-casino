import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import TabsPage from '../../../components/Common/TabsPage';
import GeneralDetails from './GeneralInformation';

const PreviewChatrain = () => {
	const location = useLocation();
	const [activeTab, setActiveTab] = useState('1');

	const chatRainDetails = location?.state?.chatRainDetails;

	const toggle = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};
	const tabData = [
		{
			id: '1',
			title: 'General',
			component: <GeneralDetails chatRainDetails={chatRainDetails} />,
		},
	];

	return (
		<div className="page-content">
			<Breadcrumb
				title="Chat Rain"
				breadcrumbItem="Chat Rain"
				titleLink="/chat/chat-rain"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
			/>
			<Container fluid>
				<TabsPage activeTab={activeTab} tabsData={tabData} toggle={toggle} />
			</Container>
		</div>
	);
};

export default PreviewChatrain;
