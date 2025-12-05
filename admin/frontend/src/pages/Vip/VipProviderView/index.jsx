import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
// import TabsPage from '../../../components/Common/TabsPage';
import GeneralDetails from './GeneralDetails';
// import Spinners from '../../../components/Common/Spinner';
import { getVIPTierByIdStart } from '../../../store/actions';
import Spinners from '../../../components/Common/Spinner';

const VipProviderView = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { vipId } = useParams();

	const { vipTierDetails, vipTierDetailsLoading } = useSelector(
		(state) => state.VIPTiers
	);

	useEffect(() => {
		dispatch(getVIPTierByIdStart({ id: vipId }));
	}, [vipId]);

	// const toggle = (tab) => {
	// 	if (activeTab !== tab) {
	// 		setActiveTab(tab);
	// 	}
	// };

	// useEffect(() => {
	// 	dispatch(getPaymentDetails({ providerId: paymentId }));
	// 	return () => {
	// 		dispatch(resetPaymentProvider());
	// 	};
	// }, [paymentId]);

	const onBackClick = () => {
		navigate('/vip');
	};

	return (
		<div className="page-content">
			<Breadcrumb
				title="Payment Provider"
				breadcrumbItem="View"
				titleLink="/vip"
				leftTitle={
					<>
						<i className="fas fa-angle-left" /> Back
					</>
				}
				callBack={onBackClick}
			/>
			<Container fluid>
				{vipTierDetailsLoading ? (
					<Spinners color="primary" />
				) : (
					<GeneralDetails vipTierDetails={vipTierDetails} />
				)}

				{/* {paymentDetailsLoading ? (
					<Spinners color="primary" />
				) : (
					<>
						<GeneralDetails paymentDetails={} />
					</>
				)} */}
			</Container>
		</div>
	);
};

export default VipProviderView;
