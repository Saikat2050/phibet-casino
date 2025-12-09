/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import React, { lazy, Suspense } from 'react';
import { Container, Row, Col, CardBody, Card } from 'reactstrap';

// import Charts
import { withTranslation } from 'react-i18next';
import { projectName } from '../../constants/config';
// import { showRightSidebarAction } from '../../store/actions';
// Pages Components
// import WelcomeComp from './WelcomeComp';

// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import useDashboardView from './hooks/useDashboardView';
import LivePlayerReports from './LivePlayerReports';
// import LoggedInPlayer from './LoggedInPlayer';

import PlayerReport from './PlayerReport';
import RevenueReport from './RevenueChart';
import DashboardFilters from './DashboardFilters';
import PurchaseChart from './PurchaseChart';
import ActivePlayerChart from './ActivePlayerChart';
import { DASH_REPORTS } from './formFields';
import FormPage from '../../components/Common/FormPage';
import Drawer from '../../components/Common/Drawer';
import RedeemChart from './RedeemChart';
import WageredChart from './BetsChart/WageredChart';
import PayoutChart from './BetsChart/PayoutChart';
import CoinActivePlayers from './ActivePlayerChart/CoinActivePlayers';
import BonusReport from './BonusReport';

const GameReport = lazy(() => import('./GameReport'));

const DashboardView = ({ t }) => {
	// meta title
	document.title = projectName;

	const {
		// statsDataLoading,
		// loggedInOptions,
		handleDashFilters,
		// statsData,
		statisticsV2Loading,
		formattedStats,
		activeUsersLoading,
		formattedActiveUsers,
		layoutModeType,
		showElementControl,
		setShowElementControl,
		formFields,
		validation,
		// showRightSidebar
	} = useDashboardView();


	console.log(formattedStats, 'formattedStatsformattedStatsformattedStats');


	const elementsToShow = validation.values;

	return (
		<div className="page-content dashboard-wrapper">
			<Container fluid>
				<Breadcrumbs
					title={t('Dashboards')}
					breadcrumbItem={t('Dashboard')}
					showRightInfo={false}
					showElementControl
					paddingBottom="10px"
					toggleElementControl={() => setShowElementControl((prev) => !prev)}
				// customActions={<div
				// 	onClick={() => {
				// 		showRightSidebarAction(!showRightSidebar);
				// 	}}
				// 	className="dropdown d-inline-block"
				// 	role="button"
				// 	tabIndex={0}
				// >
				// 	<button
				// 		type="button"
				// 		className="btn header-item noti-icon right-bar-toggle "
				// 	>
				// 		<i className="bx bx-cog bx-spin" />
				// 	</button>
				// </div>}
				/>
				<DashboardFilters handleDashFilters={handleDashFilters} />
				{elementsToShow?.[DASH_REPORTS.reportCards] ? (
					<Row>
						<LivePlayerReports />
					</Row>
				) : null}
				<Row>
					{elementsToShow?.[DASH_REPORTS.purchase] ? (
						<Col sm={12} md={12} lg={12} xl={6} xxl={6}>
							<Card>
								<CardBody>
									<h4 className="card-title font-size-16 d-flex align-items-center">
										<span className="mdi mdi-cart-outline fs-1 me-3 text-dashboard" />{' '}
										Deposit{' '}
									</h4>
									<PurchaseChart
										statsDataLoading={statisticsV2Loading}
										statsData={formattedStats}
										layoutModeType={layoutModeType}
									/>
								</CardBody>
							</Card>
						</Col>
					) : null}
					{elementsToShow?.[DASH_REPORTS.redeem] ? (
						<Col sm={12} md={12} lg={12} xl={6} xxl={6}>
							<Card>
								<CardBody>
									<h4 className="card-title font-size-16 d-flex align-items-center">
										<span className="mdi mdi-wallet-giftcard fs-1 me-3 text-dashboard" />{' '}
										Withdrawal{' '}
									</h4>
									<RedeemChart
										statsDataLoading={statisticsV2Loading}
										statsData={formattedStats}
										layoutModeType={layoutModeType}
									/>
								</CardBody>
							</Card>
						</Col>
					) : null}
					{elementsToShow?.[DASH_REPORTS.ggrReport] ? (
						<Col xxl={12}>
							<Card>
								<CardBody>
									<h4 className="card-title font-size-16 d-flex align-items-center">
										<span className="mdi mdi-finance fs-1 me-3 text-dashboard" />{' '}
										Revenue{' '}
									</h4>
									<RevenueReport
										statsData={formattedStats}
										statsDataLoading={statisticsV2Loading}
									/>
								</CardBody>
							</Card>
						</Col>
					) : null}
					{elementsToShow?.[DASH_REPORTS.payout] ? (
						<Col sm={12} md={12} lg={12} xl={6} xxl={6}>
							<Card>
								<CardBody>
									<h4 className="card-title font-size-16 d-flex align-items-center">
										<span className="mdi mdi-cash-multiple fs-1 me-3 text-dashboard" />{' '}
										Payout{' '}
									</h4>
									<PayoutChart
										chartData={formattedStats}
										layoutModeType={layoutModeType}
										statsDataLoading={statisticsV2Loading}
									/>
								</CardBody>
							</Card>
						</Col>
					) : null}
					{elementsToShow?.[DASH_REPORTS.wagered] ? (
						<Col sm={12} md={12} lg={12} xl={6} xxl={6}>
							<Card>
								<CardBody>
									<h4 className="card-title font-size-16 d-flex align-items-center">
										<span className="mdi mdi-poker-chip fs-1 me-3 text-dashboard" />{' '}
										Wagered{' '}
									</h4>
									<WageredChart
										chartData={formattedStats}
										layoutModeType={layoutModeType}
										statsDataLoading={statisticsV2Loading}
									/>
								</CardBody>
							</Card>
						</Col>
					) : null}
					{/* {elementsToShow?.[DASH_REPORTS.playerLogin] ? (
						<Col xl="3">
							<LoggedInPlayer
								loggedInOptions={loggedInOptions}
								statsDataLoading={statsDataLoading}
							/>
						</Col>
					) : null} */}
					{elementsToShow?.[DASH_REPORTS.coinPlayers] ? (
						<Col sm={12} md={12} lg={12} xl={6} xxl={6}>
							<Card>
								<CardBody className="logged-player">
									<h4 className="card-title font-size-16 d-flex align-items-center">
										<span className="mdi mdi-account-group fs-1 me-3 text-dashboard" />{' '}
										Active and New Players
									</h4>
									<CoinActivePlayers
										statsDataLoading={activeUsersLoading}
										statsData={formattedActiveUsers}
										layoutModeType={layoutModeType}
									/>
								</CardBody>
							</Card>
						</Col>
					) : null}
					{elementsToShow?.[DASH_REPORTS.activePlayers] ? (
						<Col sm={12} md={12} lg={12} xl={6} xxl={6}>
							<Card>
								<CardBody className="logged-player">
									<h4 className="card-title font-size-16 d-flex align-items-center">
										<span className="mdi mdi-account-star fs-1 me-3 text-dashboard" />{' '}
										Active players
									</h4>
									<ActivePlayerChart
										statsDataLoading={activeUsersLoading}
										statsData={formattedActiveUsers}
										layoutModeType={layoutModeType}
									/>
								</CardBody>
							</Card>
						</Col>
					) : null}
				</Row>
				<Row>
					{elementsToShow?.[DASH_REPORTS.topGames] ? (
						<Suspense>
							<GameReport />
						</Suspense>
					) : null}

					{elementsToShow?.[DASH_REPORTS.topPlayers] ? (
						<Suspense>
							<PlayerReport />
						</Suspense>
					) : null}

					{elementsToShow?.[DASH_REPORTS.bonusReport] ? (
						<Suspense>
							<BonusReport />
						</Suspense>
					) : null}
				</Row>
			</Container>
			<Drawer
				title="Dashboard Reports"
				isOpen={showElementControl}
				toggle={() => setShowElementControl((prev) => !prev)}
			>
				<FormPage
					isOpen
					setIsOpen={() => setShowElementControl((prev) => !prev)}
					validation={validation}
					responsiveFormFields={formFields}
					customColClasses="col-md-12"
					isSubmitLoading={false}
					colOptions={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6, xxl: 6 }}
					isSubmit={false}
					modalSize="lg"
				/>
			</Drawer>
		</div>
	);
};

DashboardView.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation()(DashboardView);
