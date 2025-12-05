import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';

import { projectName } from '../../constants/config';
import { getSuperAdminStart } from '../../store/auth/permissionDetails/actions';
import { getAdminChildren, updateProfileStart } from '../../store/actions';

import Overview from './FormSections/Overview';
import Password from './FormSections/Password';
import Permissions from './FormSections/Permissions';
import TabsPage from '../../components/Common/TabsPage';
import HierarchyTree from './HierarchyTree';

const ProfilePage = ({ t }) => {
	// meta title
	document.title = projectName;

	const [activeTab, setActiveTab] = useState('1');
	const [editable, setEditable] = useState(true);
	const isTenant = false;

	const toggle = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};
	const { superAdminUser, isSuperAdminLoading } = useSelector(
		(state) => state.PermissionDetails
	);

	const { resetProfilePasswordLoading } = useSelector(
		(state) => state.ProfileData
	);

	const { adminChildren } = useSelector((state) => state.AllAdmins);

	const dispatch = useDispatch();

	useEffect(() => {
		if (superAdminUser) {
			dispatch(getAdminChildren({}));
		}
	}, [superAdminUser]);

	const updateData = (data) => {
		dispatch(
			updateProfileStart({
				data,
				isTenant,
			})
		);
	};

	useEffect(() => {
		dispatch(getSuperAdminStart());
	}, []);

	const tabData = [
		{
			id: '1',
			title: 'Overview',
			component: (
				<Overview
					details={superAdminUser}
					isTenant={isTenant}
					isEditable={editable}
					setIsEditable={setEditable}
					updateData={updateData}
					isLoading={isSuperAdminLoading}
				/>
			),
		},
		{
			id: '3',
			title: 'Reset Password',
			component: (
				<Password loading={resetProfilePasswordLoading} isTenant={isTenant} />
			),
		},
		{
			id: '4',
			title: 'Permissions',
			component: <Permissions details={superAdminUser} />,
		},
		{
			id: '5',
			title: 'Tree',
			component: !isTenant && superAdminUser && superAdminUser?.id && (
				<HierarchyTree
					adminDetails={{
						name: `${superAdminUser?.firstName} ${superAdminUser?.lastName}`,
						id: superAdminUser?.id,
						children: adminChildren?.children || [],
						isInitial: true,
						data: { superRoleId: superAdminUser?.adminRoleId },
					}}
				/>
			),
		},
	];
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs title={t('Dashboard')} breadcrumbItem={t('Profile')} />
				<TabsPage activeTab={activeTab} tabsData={tabData} toggle={toggle} />
			</Container>
		</div>
	);
};

ProfilePage.propTypes = {
	t: PropTypes.func,
};

ProfilePage.defaultProps = {
	t: (string) => string,
};

export default ProfilePage;
