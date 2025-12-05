import React from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useCreate from './hooks/useCreate';
import StepFormTabs from '../../components/Common/StepFormTabs';

const CreatePayment = () => {
	const { tabData, activeTab, onBackClick } = useCreate({ isEdit: false });

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Payment Provider"
				breadcrumbItem="Create"
				// titleLink="/payment"
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

CreatePayment.propTypes = {};

export default CreatePayment;
