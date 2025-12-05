import React from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useCreateChatRain from './hooks/useCreateChatRain';
import General from './FormSections/General';

const CreateChatrain = () => {
	const {
		activeTab,
		nextPressed,
		chatRainDetails,
		setAllFields,
		setNextPressed,
		setActiveTab,
	} = useCreateChatRain();

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Chat Rain"
				breadcrumbItem="Create"
				titleLink="/chat/chat-rain"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
			/>
			<Container fluid>
				<General
					isLoading={false}
					activeTab={activeTab}
					nextPressed={nextPressed}
					setActiveTab={setActiveTab}
					setNextPressed={setNextPressed}
					setAllFields={setAllFields}
					chatRainDetails={chatRainDetails}
					isEdit={false}
				/>
			</Container>
		</div>
	);
};

CreateChatrain.propTypes = {};

export default CreateChatrain;
