import React, { useState } from 'react';
import { Container } from 'reactstrap';
import TabsPage from '../../components/Common/TabsPage';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import AddGamesToCasinoCategory from './components/AddGamesToCasinoCategory';
import AddedGamesInCasinoCategory from './components/AddedGamesInCasinoCategory';
import RemoveGamesFromCasinoCategory from './components/RemoveGamesFromCasinoCategory';

const AddGamesCasinoCategory = () => {
	const [activeTab, setActiveTab] = useState(1);
	const tabData = [
		{
			id: 1,
			title: 'Added Games',
			component: <AddedGamesInCasinoCategory />,
		},
		{
			id: 2,
			title: 'Add Games to Casino Category',
			component: <AddGamesToCasinoCategory />,
		},
		{
			id: 3,
			title: 'Remove Games from Casino Category',
			component: <RemoveGamesFromCasinoCategory />,
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

export default AddGamesCasinoCategory;
