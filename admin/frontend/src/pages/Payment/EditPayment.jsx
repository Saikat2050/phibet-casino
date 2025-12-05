import React from 'react';
import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useCreate from './hooks/useCreate';
import StepFormTabs from '../../components/Common/StepFormTabs';
import Spinners from '../../components/Common/Spinner';

const EditPayment = () => {
	const { tabData, activeTab, onBackClick, paymentDetailsLoading } = useCreate({
		isEdit: true,
	});

	return (
		<div className="page-content">
			<Breadcrumbs
				title="Payment Provider"
				breadcrumbItem="Edit"
				// titleLink="/payment"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
				callBack={onBackClick}
			/>
			<Container fluid>
				{paymentDetailsLoading ? (
					<Spinners
						color="primary"
						className="position-absolute top-50 start-50"
					/>
				) : (
					<StepFormTabs activeTab={activeTab} tabsData={tabData} />
				)}
			</Container>
		</div>
	);
};

EditPayment.propTypes = {};

export default EditPayment;
