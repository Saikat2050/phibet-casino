import React from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import StepFormTabs from '../../components/Common/StepFormTabs';
import useCreateTournaments from './hooks/useCreateTournament';

const EditTournament = () => {
	const { tabData, activeTab } = useCreateTournaments();

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Tournaments"
				breadcrumbItem="Edit"
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
					submitButtonText="Update"
				/>
			</Container>
		</div>
	);
};

EditTournament.propTypes = {};

export default EditTournament;
