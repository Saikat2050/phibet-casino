/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import TabsPage from '../../components/Common/TabsPage';
import Permissions from '../Profile/FormSections/Permissions';
import Breadcrumbs from '../../components/Common/Breadcrumb';
// eslint-disable-next-line import/no-unresolved
import OverView from './Overview';
import { STORAGE_KEY } from '../../components/Common/constants';
import { decryptCredentials } from '../../network/storageUtils';

const AdminDetails = ({ t }) => {
	const { adminUserId } = useParams();
	const navigate = useNavigate();
	const [adminData, setAdminData] = useState({});

	const [activeTab, setactiveTab] = useState('1');

	useEffect(() => {
		const admin = decryptCredentials(
			localStorage.getItem(`${STORAGE_KEY.ADMIN_VIEW}_${adminUserId}`)
		);
		if (admin) {
			let data = JSON.parse(admin);
			data = {
				...data,
				permission: {
					...data.permission,
					permission: data?.permission?.permission
						? typeof data?.permission?.permission === 'string'
							? JSON.parse(data?.permission?.permission)
							: data.permission.permission
						: {},
				},
			};
			setAdminData(data);
		} else {
			navigate('/staff');
		}
		return () =>
			localStorage.removeItem(`${STORAGE_KEY.ADMIN_VIEW}_${adminUserId}`);
	}, []);

	const tabData = [
		{
			id: '1',
			title: 'Overview',
			component: <OverView details={adminData} t={t} />,
		},
		{
			id: '2',
			title: 'Permissions',
			component: <Permissions details={adminData} />,
		},
	];

	const toggle = (tab) => {
		if (activeTab !== tab) {
			setactiveTab(tab);
		}
	};

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					showRightInfo={false}
					showBackButton
					breadcrumbItem={`${adminData?.adminRole?.name}: ${
						adminData.firstName || ''
					} ${adminData.lastName || ''}`}
				/>
				<TabsPage activeTab={activeTab} tabsData={tabData} toggle={toggle} />
			</Container>
		</div>
	);
};

AdminDetails.propTypes = {
	t: PropTypes.func,
};

AdminDetails.defaultProps = {
	t: (string) => string,
};

export default AdminDetails;
