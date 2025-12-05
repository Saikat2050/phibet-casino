import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'reactstrap';
import TabsPage from '../../components/Common/TabsPage';
import RestrictedGames from './components/RestrictedGames';
import AddRestrictedGames from './components/AddRestrictedGames';
import RemoveRestrictedGames from './components/RemoveRestrictedGames';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import {
	resetRestrictedItemsData,
	resetUnrestrictedItemsData,
} from '../../store/actions';

const ViewRestrictedGames = () => {
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState(1);
	const tabData = [
		{
			id: 1,
			title: 'Restricted Games',
			component: <RestrictedGames />,
		},
		{
			id: 2,
			title: 'Add to Restricted Games',
			component: <AddRestrictedGames />,
		},
		{
			id: 3,
			title: 'Remove from Restricted Games',
			component: <RemoveRestrictedGames />,
		},
	];

	// resetting restricted and unrestricted list redux state
	useEffect(
		() => () => {
			dispatch(resetRestrictedItemsData());
			dispatch(resetUnrestrictedItemsData());
		},
		[]
	);

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

export default ViewRestrictedGames;
