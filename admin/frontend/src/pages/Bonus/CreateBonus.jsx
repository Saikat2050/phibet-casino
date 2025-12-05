import React from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useCreateBonus from './hooks/useCreateBonus';
import StepFormTabs from '../../components/Common/StepFormTabs';

const CreateBonus = () => {
	const { tabData, activeTab, onBackClick } = useCreateBonus({ isEdit: false });

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Bonus"
				breadcrumbItem="Create"
				// titleLink="/bonus"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
				callBack={onBackClick}
			/>
			<Container fluid>
				<StepFormTabs activeTab={activeTab} tabsData={tabData} />
			</Container>
		</div>
	);
};

CreateBonus.propTypes = {};

export default CreateBonus;
