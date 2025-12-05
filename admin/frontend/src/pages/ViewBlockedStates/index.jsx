import React, { useState } from 'react';
import { Container } from 'reactstrap';
import TabsPage from '../../components/Common/TabsPage';
import RestrictedStates from './components/RestrictedStates';
import AddToRestrictedStates from './components/AddToRestrictedStates';
import RemoveFromRestrictedStates from './components/RemoveFromRestrictedStates';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useRestrictedStates from './hooks/useRestrictedStates';
import { modules } from '../../constants/permissions';
import usePermission from '../../components/Common/Hooks/usePermission';

const ViewBlockedStates = () => {
	const [activeTab, setActiveTab] = useState(1);
	const { isGranted } = usePermission();
	const { restrictedStates, unrestrictedStates } = useRestrictedStates();

	const tabData = [
		{
			id: 1,
			title: 'Restricted States',
			component: <RestrictedStates restrictedStates={restrictedStates} />,
		},
		{
			id: 2,
			title: 'Add to Restricted States',
			component: (
				<AddToRestrictedStates unrestrictedStates={unrestrictedStates} />
			),
			isHidden: !isGranted(modules.casinoManagement, 'U'),
		},
		{
			id: 3,
			title: 'Remove from Restricted States',
			component: (
				<RemoveFromRestrictedStates restrictedStates={restrictedStates} />
			),
			isHidden: !isGranted(modules.casinoManagement, 'U'),
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

export default ViewBlockedStates;
