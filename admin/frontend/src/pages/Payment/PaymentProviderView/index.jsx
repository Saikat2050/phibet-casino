import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Currencies from './Currency';
import Breadcrumb from '../../../components/Common/Breadcrumb';
// import TabsPage from '../../../components/Common/TabsPage';
import GeneralDetails from './GeneralInformation';
import Spinners from '../../../components/Common/Spinner';
import {
	getPaymentDetails,
	resetPaymentProvider,
} from '../../../store/actions';

const PaymentProviderView = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { paymentId } = useParams();
	// const [activeTab, setActiveTab] = useState('1');

	const { paymentDetailsLoading, paymentDetails } = useSelector(
		(state) => state.Payment
	);

	// const toggle = (tab) => {
	// 	if (activeTab !== tab) {
	// 		setActiveTab(tab);
	// 	}
	// };

	useEffect(() => {
		dispatch(getPaymentDetails({ providerId: paymentId }));
		return () => {
			dispatch(resetPaymentProvider());
		};
	}, [paymentId]);

	const onBackClick = () => {
		navigate('/payment');
	};

	// const tabData = [
	// 	{
	// 		id: '1',
	// 		title: 'General',
	// 		component: <GeneralDetails paymentDetails={paymentDetails} />,
	// 	},
	// 	{
	// 		id: '2',
	// 		title: 'Currency',
	// 		component: <Currencies paymentDetails={paymentDetails} />,
	// 	},
	// ];

	return (
		<div className="page-content">
			<Breadcrumb
				title="Payment Provider"
				breadcrumbItem="View"
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
					<Spinners color="primary" />
				) : (
					// <TabsPage activeTab={activeTab} tabsData={tabData} toggle={toggle} />
					<>
						<GeneralDetails paymentDetails={paymentDetails} />
						<Currencies paymentDetails={paymentDetails} />
					</>
				)}
			</Container>
		</div>
	);
};

export default PaymentProviderView;
