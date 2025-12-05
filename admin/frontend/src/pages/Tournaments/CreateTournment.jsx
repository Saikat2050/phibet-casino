import React from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import StepFormTabs from '../../components/Common/StepFormTabs';
import useCreateTournaments from './hooks/useCreateTournament';

const CreateTournament = () => {
	const { tabData, activeTab } = useCreateTournaments();

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Tournaments"
				breadcrumbItem="Create"
				titleLink="/tournaments"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
			/>
			<Container fluid>
				<StepFormTabs
					activeTab={activeTab}
					tabsData={tabData}
					submitButtonText="Create"
				/>
			</Container>
		</div>
	);
};

CreateTournament.propTypes = {};

export default CreateTournament;
