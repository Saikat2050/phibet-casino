import React, { useState } from 'react';
import { Container } from 'reactstrap';
import TabsPage from '../../components/Common/TabsPage';
import RestrictedCountries from './components/RestrictedCountries';
import AddToRestrictedCountries from './components/AddToRestrictedCountries';
import RemoveFromRestrictedCountries from './components/RemoveFromRestrictedCountries';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useRestrictedCountries from './hooks/useRestrictedCountries';

const ViewBlockedCountries = () => {
	const [activeTab, setActiveTab] = useState(1);

	const { restrictedCountries, unrestrictedCountries } =
		useRestrictedCountries();

	const tabData = [
		{
			id: 1,
			title: 'Restricted Countries',
			component: (
				<RestrictedCountries restrictedCountries={restrictedCountries} />
			),
		},
		{
			id: 2,
			title: 'Add to Restricted Countries',
			component: (
				<AddToRestrictedCountries
					unrestrictedCountries={unrestrictedCountries}
				/>
			),
		},
		{
			id: 3,
			title: 'Remove from Restricted Countries',
			component: (
				<RemoveFromRestrictedCountries
					restrictedCountries={restrictedCountries}
				/>
			),
		},
	];

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs showBackButton showRightInfo={false} />
				<TabsPage
					activeTab={activeTab}
					tabsData={tabData}
					toggle={setActiveTab}
				/>
			</Container>
		</div>
	);
};

export default ViewBlockedCountries;
