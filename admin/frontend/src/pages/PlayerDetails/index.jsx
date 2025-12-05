import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TabsPage from '../../components/Common/TabsPage';
import Breadcrumb from '../../components/Common/Breadcrumb';
import Overview from './Overview';
import PlayerWallet from './PlayerWallet';
import useUserDetails from './hooks/useUserDetails';
// import Limits from './Limits';
import { modules } from '../../constants/permissions';
import { getUserDetails, resetUserLimitData } from '../../store/actions';
import usePermission from '../../components/Common/Hooks/usePermission';
// import UserDocsList from './components/UserDocsList';
import Ledger from '../Ledger';
import Notes from './Notes';
import TransactionBankingList from '../TransactionBankingList';
import CasinoTransactionsList from '../CasinoTransactionsList';
import Referrals from './Referrals';
import RSG from './Limits';

const PlayerDetailsPage = ({ t }) => {
	const { isGranted } = usePermission();
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState(1);
	const { playerId } = useParams();
	const { search } = useLocation();
	const params = new URLSearchParams(search);
	const tabNumber = params.get('tabNumber');

	const {
		resetUserLimitSuccess,
		markUserAsInternalSuccess,
		updateSAUserStatusSuccess,
		verifyUserEmailSuccess,
		verifyUserPhoneSuccess,
		verifyUserKycSuccess,
		updateUserTagsSuccess,
		depositToOtherSuccess,
		updateUserInfoSuccess,
		createTag: createTagSuccess,
		attachTag: attachTagSuccess,
		removeUserTag: removeUserTagSuccess,
		activeKyc,
		inActiveKyc,
		createUserCommentsSuccess,
		updateUserCommentSuccess,
		deleteUserCommentSuccess,
	} = useSelector((state) => state.UserDetails);

	const toggle = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};

	useEffect(() => {
		if (
			resetUserLimitSuccess ||
			markUserAsInternalSuccess ||
			updateSAUserStatusSuccess ||
			verifyUserEmailSuccess ||
			updateUserTagsSuccess ||
			depositToOtherSuccess ||
			updateUserInfoSuccess ||
			createTagSuccess ||
			attachTagSuccess ||
			removeUserTagSuccess ||
			activeKyc ||
			inActiveKyc ||
			updateUserCommentSuccess ||
			deleteUserCommentSuccess ||
			createUserCommentsSuccess ||
			verifyUserPhoneSuccess ||
			verifyUserKycSuccess
		) {
			dispatch(getUserDetails({ playerId }));
			dispatch(resetUserLimitData());
		}
	}, [
		resetUserLimitSuccess,
		markUserAsInternalSuccess,
		updateSAUserStatusSuccess,
		verifyUserEmailSuccess,
		updateUserTagsSuccess,
		depositToOtherSuccess,
		updateUserInfoSuccess,
		createTagSuccess,
		attachTagSuccess,
		removeUserTagSuccess,
		activeKyc,
		inActiveKyc,
		updateUserCommentSuccess,
		deleteUserCommentSuccess,
		createUserCommentsSuccess,
		verifyUserPhoneSuccess,
		verifyUserKycSuccess,
	]);

	useEffect(() => setActiveTab(Number(tabNumber || 1)), [playerId, tabNumber]);

	const { userWalletData, userDetails, userDetailsLoading, duplicateUsers } =
		useUserDetails({
			userId: playerId,
		});

	const tabData = [
		{
			id: 1,
			title: 'Overview',
			component: (
				<Overview
					userDetails={userDetails}
					userDetailsLoading={userDetailsLoading}
					duplicateUsers={duplicateUsers}
				/>
			),
		},
		{
			id: 2,
			title: 'Responsible Gaming',
			component: (
				<RSG
					userDetails={userDetails}
					userId={playerId}
					userDetailsLoading={userDetailsLoading}
				/>
			),
			isHidden: !isGranted(modules.player, 'U'),
		},
		{
			id: 3,
			title: 'Wallet',
			component: (
				<PlayerWallet
					userDetails={userDetails}
					userWalletData={userWalletData}
				/>
			),
		},
		{
			id: 4,
			title: 'Reports',
			isDropdown: true,
			dropdownItems: [
				{
					id: 1,
					title: 'Banking',
					component: <TransactionBankingList userId={playerId} />,
				},
				{
					id: 2,
					title: 'Casino',
					component: <CasinoTransactionsList userId={playerId} />,
				},
				{
					id: 3,
					title: 'Ledgers',
					component: <Ledger userId={playerId} />,
				},
			],
		},

		// {
		// 	id: 5,
		// 	title: 'KYC Settings',
		// 	isHidden: !isGranted(modules.kyc, 'R'),
		// 	component: <UserDocsList userDetails={userDetails} userId={playerId} />,
		// },
		{
			id: 6,
			title: 'Referrals',
			component: <Referrals userId={playerId} />,
			isHidden: !isGranted(modules.referral, 'R'),
		},
		{
			id: 7,
			title: 'Notes',
			component: <Notes userId={playerId} userDetails={userDetails} />,
			isHidden: !isGranted(modules.comment, 'R'),
		},
	];

	const leftTitle = userDetailsLoading
		? 'Player Details'
		: `Player Details : ${userDetails?.firstName || userDetails?.email} ${
				userDetails?.lastName || ''
		  }`;

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumb
					leftTitle={leftTitle}
					title={t('Player')}
					breadcrumbItem={t('Player Details')}
					showBackButton
				/>
				<TabsPage activeTab={activeTab} tabsData={tabData} toggle={toggle} />
			</Container>
		</div>
	);
};

PlayerDetailsPage.propTypes = {
	t: PropTypes.func,
};

PlayerDetailsPage.defaultProps = {
	t: (string) => string,
};

export default PlayerDetailsPage;
