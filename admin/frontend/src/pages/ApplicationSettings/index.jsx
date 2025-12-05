import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';

import { projectName } from '../../constants/config';
import { getSiteConfigurationStart } from '../../store/actions';
import TabsPage from '../../components/Common/TabsPage';
import SiteConfig from './FormSections/Configuration';
import Settings from './FormSections/Settings';

const ApplicationSettings = ({ t }) => {
	document.title = projectName;

	const [activeTab, setActiveTab] = useState('1');
	const toggle = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};

	const { siteConfigDetails } = useSelector((state) => state.ProfileData);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getSiteConfigurationStart());
	}, []);

	const tabData = [
		{
			id: '1',
			title: 'Configuration',
			component: <SiteConfig details={siteConfigDetails} />,
		},
		{
			id: '2',
			title: 'Settings',
			component: <Settings details={siteConfigDetails} />,
		},
	];
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={t('Site Configuration')}
					breadcrumbItem={t('Application Settings')}
				/>
				<TabsPage activeTab={activeTab} tabsData={tabData} toggle={toggle} />
			</Container>
		</div>
	);
};
ApplicationSettings.propTypes = {
	t: PropTypes.func,
};
ApplicationSettings.defaultProps = {
	t: (string) => string,
};

export default ApplicationSettings;
