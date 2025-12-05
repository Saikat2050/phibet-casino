import React from 'react';
// import CountriesList from '../pages/CountriesList';
import PlayersList from '../pages/Players';
import Admins from '../pages/Admins';
import Cms from '../pages/Cms';
import CreateCMS from '../pages/Cms/CreateCMS';
import EditCMS from '../pages/Cms/EditCMS';
import CMSDetails from '../pages/Cms/CMSDetails';
import CasinoCategory from '../pages/CasinoCategory';
import CasinoAggregators from '../pages/Casino Management/Aggregators';
import BonusDetail from '../pages/Bonus';
// import LanguageList from '../pages/LanguageList';
import CurrencyList from '../pages/CurrencyList';
import StatesList from '../pages/StatesList';
// import LanguageManagementList from '../pages/LanguageManagement';
// import BetSettings from '../pages/BetSettings';
import TransactionBankingListing from '../pages/TransactionBankingList';
// import ReviewManagementList from '../pages/ReviewManagementList';
import CasinoTransactionsList from '../pages/CasinoTransactionsList';
// import WithdrawRequestsList from '../pages/WithdrawRequestsList';
import CasinoProviders from '../pages/CasinoProviders';
import CasinoGames from '../pages/CasinoGames';
import BannerManagement from '../pages/BannerManagement';
// import SportsMatchesList from '../pages/SportsMatchesList';
// import SportsMarketsList from '../pages/SportsMarketsList';
import EmailTemplate from '../pages/EmailTemplate';
import KYCLabels from '../pages/KYCLabels';
import WageringTemplate from '../pages/WageringTemplateDetail';
import CreateWageringTemplate from '../pages/WageringTemplateDetail/createWageringTemplate';
import EditWageringTemplate from '../pages/WageringTemplateDetail/editWageringTemplate';
import WageringTemplateDetailList from '../pages/WageringTemplateDetail/WageringTemplateDetailList';
import ProfilePage from '../pages/Profile';
import AddAdmin from '../pages/Admins/addAdmin';
import EditAdmin from '../pages/Admins/editAdmin';
// import RegistrationFields from '../pages/RegistrationFormFields';
// import LoyaltyManagement from '../pages/LoyaltyManagement';
import DashboardView from '../pages/DashboardView';
import PlayerDetailsPage from '../pages/PlayerDetails';
import ImageGallery from '../pages/ImageGallery';
import CreateBonus from '../pages/Bonus/CreateBonus';
import AdminDetails from '../pages/AdminDetails';
import ViewBlockedCountries from '../pages/ViewBlockedCountries';
import CreateEmailTemplate from '../pages/EmailTemplate/CreateEmailTemplate';
import EditEmailTemplate from '../pages/EmailTemplate/EditEmailTemplate';
// import SportsMatchDetail from '../pages/SportsMatchDetail';
import LoginRight from '../pages/Authentication/Login/LoginRight';
import ViewRestrictedGames from '../pages/ViewRestrictedGames';
import ViewRestrictedProviders from '../pages/ViewRestrictedProviders';
import ReorderCategories from '../pages/CasinoCategory/ReorderCategories';
import BonusPreview from '../pages/Bonus/BonusView';
import EditBonus from '../pages/Bonus/EditBonus';
import ReorderGames from '../pages/CasinoGames/components/ReorderGames';
import ReorderBonus from '../pages/Bonus/ReorderBonus';
import { modules } from '../constants/permissions';
import ApplicationSettings from '../pages/ApplicationSettings';
import GameTransactionsList from '../pages/CasinoGameTransactions';
import PlayerPerformance from '../pages/PlayerPerformance';
// import Tournament from '../pages/Tournaments';
// import CreateTournament from '../pages/Tournaments/CreateTournment';
// import TournamentDetail from '../pages/Tournaments/TournamentDetail';
import AddGamesCasinoCategory from '../pages/AddGamesCasinoCategory';
// import EditTournament from '../pages/Tournaments/EditTournament';
import PaymentProviders from '../pages/Payment';
import CreatePayment from '../pages/Payment/CreatePayment';
import PaymentProviderView from '../pages/Payment/PaymentProviderView';
import EditPayment from '../pages/Payment/EditPayment';
import Notifications from '../pages/Notifications';
import NotifyPlayers from '../pages/Notifications/components/NotifyPlayers';
import AllReferrals from '../pages/AllReferrals';
import BulkUpdate from '../pages/Players/bulkUpdate';
import NotificationDetails from '../pages/Notifications/components/NotificationDetails';
// import Channels from '../pages/Channels';
// import ChatRain from '../pages/ChatRain';
// import CreateChannel from '../pages/Channels/CreateChannel';
// import CreateChatRain from '../pages/ChatRain/CreateChatRain';
// import PreviewChatrain from '../pages/ChatRain/ChatrainView';
// import EditChatrain from '../pages/ChatRain/EditChatrain';
import AddNewProvider from '../pages/Payment/addNewProvider';
import Segmentation from '../pages/Segmentation';
import AdminActivity from '../pages/AdminActivity';
import Packages from '../pages/Packages';
import CreatePackage from '../pages/Packages/CreatePackage';
// import RedeemRequests from '../pages/RedeemRequests';
import UpdatePackage from '../pages/Packages/UpdatePackage';
import ReorderPackages from '../pages/Packages/ReorderPackages';
import Ledger from '../pages/Ledger';
import AMOE from '../pages/AMOE';
import UpdateAMOE from '../pages/AMOE/updateAMOE';
import SpinWheelListing from '../pages/SpinWheel';
import VIPtiers from '../pages/Vip';
import CreateVip from '../pages/Vip/CreateVip';
import UpdateVip from '../pages/Vip/UpdateVip';
import VipProviderView from '../pages/Vip/VipProviderView';
import WithdrawalRequestDetail from '../pages/WithdrawalRequests';
import ReorderProviders from '../pages/CasinoProviders/ReorderProviders';
import ViewBlockedStates from '../pages/ViewBlockedStates';
import UpdateBanner from '../pages/BannerManagement/UpdateBanner';
// import MetaTags from '../pages/MetaTages';
// import ViewSeoRouteDetails from '../pages/MetaTages/ViewSeoRouteDetails';
import CreateSegmentation from '../pages/Segmentation/CreateSegmentation';
import EditSegmentation from '../pages/Segmentation/EditSegmentation';
import SegmentationDetails from '../pages/Segmentation/SegmentationDetails';
import AdvanceFilter from '../pages/AdvanceFilter';
import AdvanceFilterListing from '../pages/AdvanceFilter/AdvanceFilterListing';
import CreateGames from '../pages/CasinoGames/components/CreateGames';
import Testimonial from '../pages/Testimonials/Testimonial';
import CreateTestimonial from '../pages/Testimonials/CreateTestimonial';
import EditTestimonial from '../pages/Testimonials/EditTestimonial';
import TestimonialDetail from '../pages/Testimonials/TestimonialDetail';

const authProtectedRoutes = [
	{
		path: '/',
		component: <DashboardView />,
		modules: [],
		operation: 'R',
		isHome: true,
	},
	{
		path: '/dashboard',
		component: <DashboardView />,
		modules: [],
		operation: 'R',
	},

	// Staff/Admin
	{
		path: '/staff',
		component: <Admins />,
		modules: [modules.admin],
		operation: 'R',
	},
	{
		path: '/staff/add',
		component: <AddAdmin />,
		modules: [modules.admin],
		operation: 'C',
	},
	{
		path: '/staff/details/:adminUserId',
		component: <AdminDetails />,
		modules: [modules.admin],
		operation: 'R',
	},
	{
		path: '/staff/edit/:adminUserId',
		component: <EditAdmin />,
		modules: [modules.admin],
		operation: 'U',
	},

	{
		path: '/categories',
		component: <CasinoCategory />,
		modules: [modules.casinoManagement],
		operation: 'R',
	},
	{
		path: '/categories/reorder/lobby',
		component: <ReorderCategories />,
		modules: [modules.casinoManagement],
		operation: 'R',
	},
	{
		path: '/categories/reorder/sidebar',
		component: <ReorderCategories />,
		modules: [modules.casinoManagement],
		operation: 'R',
	},
	{
		path: '/casino-providers/reorder',
		component: <ReorderProviders />,
		modules: [modules.casinoManagement],
		operation: 'R',
	},
	{
		path: '/categories/addGames/:categoryId',
		component: <AddGamesCasinoCategory />,
		modules: [modules.casinoManagement],
		operation: 'C',
	},
	{
		path: '/casino-games/restricted-states/:casinoGameId',
		component: <ViewBlockedStates />,
		modules: [modules.casinoManagement],
		operation: 'R',
	},
	{
		path: '/casino-providers/restricted-states/:casinoProviderId',
		component: <ViewBlockedStates />,
		modules: [modules.casinoManagement],
		operation: 'R',
	},
	// {
	// 	path: '/countries',
	// 	component: <CountriesList />,
	// 	modules: [modules.country],
	// 	operation: 'R',
	// },
	{
		path: '/countries/restricted-games/:countryId',
		component: <ViewRestrictedGames />,
		modules: [modules.casinoManagement],
		operation: 'U',
	},
	{
		path: '/countries/restricted-providers/:countryId',
		component: <ViewRestrictedProviders />,
		modules: [modules.casinoManagement],
		operation: 'U',
	},
	{
		path: '/players',
		component: <PlayersList />,
		modules: [modules.player],
		operation: 'R',
	},

	{
		path: '/players-bulk-update',
		component: <BulkUpdate />,
		modules: [modules.player],
		operation: 'U',
	},
	{ path: '/cms', component: <Cms />, modules: [modules.page], operation: 'R' },
	{
		path: '/cms/create',
		component: <CreateCMS />,
		modules: [modules.page],
		operation: 'C',
	},
	{
		path: '/cms/edit/:cmsPageId',
		component: <EditCMS />,
		modules: [modules.page],
		operation: 'U',
	},
	{
		path: '/cms/details/:cmsPageId',
		component: <CMSDetails />,
		modules: [modules.page],
		operation: 'R',
	},
	{
		path: '/casino-aggregators',
		component: <CasinoAggregators />,
		modules: [modules.casinoManagement],
		operation: 'R',
	},
	{
		path: '/bonus',
		component: <BonusDetail />,
		modules: [modules.bonus],
		operation: 'R',
	},
	{
		path: '/bonus/reorder',
		component: <ReorderBonus />,
		modules: [modules.bonus],
		operation: 'U',
	},
	{
		path: '/bonus/:bonusId/:bonusType',
		component: <BonusPreview />,
		modules: [modules.bonus],
		operation: 'R',
	},
	{
		path: '/bonus/create',
		component: <CreateBonus />,
		modules: [modules.bonus],
		operation: 'C',
	},
	{
		path: '/bonus/edit/:bonusId/:bonusType',
		component: <EditBonus />,
		modules: [modules.bonus],
		operation: 'U',
	},
	{
		path: '/referral',
		component: <AllReferrals />,
		modules: [modules.referral],
		operation: 'R',
	},
	// {
	// 	path: '/languages',
	// 	component: <LanguageList />,
	// 	modules: [modules.language],
	// 	operation: 'R',
	// },
	// {
	// 	path: '/languages-management',
	// 	component: <LanguageManagementList />,
	// 	modules: [modules.language],
	// 	operation: 'R',
	// },
	{
		path: '/notifications',
		component: <Notifications />,
		// FIXME: Update the permission
		modules: [modules.notification],
		operation: 'R',
	},
	{
		path: '/send-notification',
		component: <NotifyPlayers />,
		// FIXME: Update the permission
		modules: [modules.notification],
		operation: 'R',
	},
	{
		path: '/notification-details',
		component: <NotificationDetails />,
		// FIXME: Update the permission
		modules: [modules.notification],
		operation: 'R',
	},
	{
		path: '/application-settings',
		component: <ApplicationSettings />,
		modules: [modules.applicationSetting],
		operation: 'R',
	},
	// {
	// 	path: '/bet-settings',
	// 	component: <BetSettings />,
	// 	modules: [modules.BetSettings],
	// 	operation: 'R',
	// },
	{
		path: '/transaction',
		component: <TransactionBankingListing />,
		modules: [modules.reportTransaction],
		operation: 'R',
	},
	// {
	// 	path: '/review-management',
	// 	component: <ReviewManagementList />,
	// 	modules: [modules.review],
	// 	operation: 'R',
	// },
	{
		path: '/casino-transactions',
		component: <CasinoTransactionsList />,
		modules: [modules.reportCasinoTransaction],
		operation: 'R',
	},
	{
		path: '/game-report',
		component: <GameTransactionsList />,
		modules: [modules.gameReport],
		operation: 'R',
	},
	{
		path: '/player-performance',
		component: <PlayerPerformance />,
		modules: [modules.reportPlayerPerformance],
		operation: 'R',
	},
	// {
	// 	path: '/tournaments',
	// 	component: <Tournament />,
	// 	modules: [modules.tournamentManagement],
	// 	operation: 'R',
	// },
	// {
	// 	path: '/tournaments/create',
	// 	component: <CreateTournament />,
	// 	modules: [modules.tournamentManagement],
	// 	operation: 'R',
	// },
	// {
	// 	path: '/tournaments/view/:tournamentId',
	// 	component: <TournamentDetail />,
	// 	modules: [modules.tournamentManagement],
	// 	operation: 'R',
	// },
	// {
	// 	path: '/tournaments/edit/:tournamentId',
	// 	component: <EditTournament />,
	// 	modules: [modules.tournamentManagement],
	// 	operation: 'R',
	// },
	// {
	// 	path: '/withdraw-request',
	// 	component: <WithdrawRequestsList />,
	// 	modules: [modules.report],
	// 	operation: 'R',
	// },
	{
		path: '/casino-providers',
		component: <CasinoProviders />,
		modules: [modules.casinoManagement],
		operation: 'R',
	},
	{
		path: '/casino-games',
		component: <CasinoGames />,
		modules: [modules.casinoManagement],
		operation: 'R',
	},
	{
		path: '/casino-games/reorder',
		component: <ReorderGames />,
		modules: [modules.casinoManagement],
		operation: 'U',
	},
	{
		path: '/banner-management',
		component: <BannerManagement />,
		modules: [modules.banner],
		operation: 'R',
	},
	// {
	// 	path: '/matches',
	// 	component: <SportsMatchesList />,
	// 	modules: [modules.sportsbookManagement],
	// 	operation: 'R',
	// },
	// {
	// 	path: '/match/:matchId',
	// 	component: <SportsMatchDetail />,
	// 	modules: [modules.sportsbookManagement],
	// 	operation: 'R',
	// },
	// {
	// 	path: '/markets',
	// 	component: <SportsMarketsList />,
	// 	modules: [modules.sportsbookManagement],
	// 	operation: 'R',
	// },
	{
		path: '/email-templates',
		component: <EmailTemplate />,
		modules: [modules.emailTemplate],
		operation: 'R',
	},
	{
		path: '/email-templates/create',
		component: <CreateEmailTemplate />,
		// modules: [modules.emailTemplate],
		operation: 'C',
	},
	{
		path: '/email-templates/edit/:emailTemplateId',
		component: <EditEmailTemplate />,
		modules: [modules.emailTemplate],
		operation: 'U',
	},
	{
		path: '/kyc-labels',
		component: <KYCLabels />,
		modules: [modules.kyc],
		operation: 'R',
	},
	{
		path: '/wagering-template',
		component: <WageringTemplate />,
		modules: [modules.bonus],
		operation: 'R',
	},
	{
		path: '/wagering-template/create',
		component: <CreateWageringTemplate />,
		modules: [modules.bonus],
		operation: 'C',
	},
	{
		path: '/wagering-template/edit/:wageringTemplateId',
		component: <EditWageringTemplate />,
		modules: [modules.bonus],
		operation: 'U',
	},
	{
		path: '/wagering-template/details/:wageringTemplateId',
		component: <WageringTemplateDetailList />,
		modules: [modules.bonus],
		operation: 'R',
	},
	{ path: '/profile', component: <ProfilePage /> },
	// {
	// 	path: '/form-fields',
	// 	component: <RegistrationFields />,
	// 	modules: [modules.RegistrationField],
	// 	operation: 'R',
	// },
	// {
	// 	path: '/loyalty-management',
	// 	component: <LoyaltyManagement />,
	// 	modules: [modules.LoyaltyManagement],
	// 	operation: 'R',
	// },
	{
		path: '/player-details/:playerId',
		component: <PlayerDetailsPage />,
		modules: [modules.player],
		operation: 'R',
	},
	{
		path: '/image-gallery',
		component: <ImageGallery />,
		modules: [modules.gallery],
		operation: 'R',
	},
	{
		path: '/casino-providers/restrict-countries/:casinoProviderId',
		component: <ViewBlockedCountries />,
		modules: [modules.casinoManagement],
		operation: 'U',
	},
	{
		path: '/casino-games/restrict-countries/:casinoGameId',
		component: <ViewBlockedCountries />,
		modules: [modules.casinoManagement],
		operation: 'U',
	},
	{
		path: '/payment',
		component: <PaymentProviders />,
		modules: [modules.paymentManagement],
		operation: 'R',
	},
	{
		path: '/payment/add',
		component: <CreatePayment />,
		modules: [modules.paymentManagement],
		operation: 'C',
	},
	{
		path: '/payment/add-provider',
		component: <AddNewProvider />,
		modules: [modules.paymentManagement],
		operation: 'C',
	},
	{
		path: '/casino-games/add-games',
		component: <CreateGames />,
		modules: [modules.casinoManagement],
		operation: 'U',
	},
	{
		path: '/payment/edit/:paymentId',
		component: <EditPayment />,
		modules: [modules.paymentManagement],
		operation: 'U',
	},
	{
		path: '/payment/details/:paymentId',
		component: <PaymentProviderView />,
		modules: [modules.paymentManagement],
		operation: 'R',
	},
	// {
	// 	path: '/chat/channels',
	// 	component: <Channels />,
	// 	modules: [modules.paymentManagement],
	// 	operation: 'C',
	// },
	// {
	// 	path: '/chat/chat-rain',
	// 	component: <ChatRain />,
	// 	modules: [modules.paymentManagement],
	// 	operation: 'C',
	// },
	// {
	// 	path: '/chat/channel/create',
	// 	component: <CreateChannel />,
	// },
	// {
	// 	path: '/chat/chat-rain/add',
	// 	component: <CreateChatRain />,
	// 	modules: [modules.paymentManagement],
	// 	operation: 'C',
	// },
	// {
	// 	path: '/chat/chat-rain/edit/:chatRainId',
	// 	component: <EditChatrain />,
	// 	modules: [modules.paymentManagement],
	// 	operation: 'C',
	// },
	// {
	// 	path: '/chat/chat-rain/:chatRainId',
	// 	component: <PreviewChatrain />,
	// 	modules: [modules.paymentManagement],
	// 	operation: 'C',
	// },
	{
		path: '/segmentation',
		component: <Segmentation />,
		modules: [modules.segmentation],
		operation: 'R',
	},
	{
		path: '/admin-activity/:adminUserId',
		component: <AdminActivity />,
		modules: [modules.player],
		operation: 'R',
	},
	{
		path: '/packages',
		component: <Packages />,
		modules: [modules.package],
	},
	{
		path: '/redeem-requests',
		component: <WithdrawalRequestDetail />,
		modules: [modules.redeem],
		operation: 'R',
	},
	// {
	// 	path: '/redeem-requests',
	// 	component: <RedeemRequests />,
	// 	modules: [modules.redeem],
	// 	operation: 'R',
	// },
	{
		path: '/packages/create',
		component: <CreatePackage />,
		modules: [modules.package],
		operation: 'C',
	},
	{
		path: '/packages/edit/:packageId',
		component: <UpdatePackage />,
		modules: [modules.package],
		operation: 'U',
	},
	{
		path: '/packages/reorder',
		component: <ReorderPackages />,
		modules: [modules.package],
		operation: 'U',
	},
	{
		path: '/ledgers',
		component: <Ledger />,
		modules: [modules.reportLedger],
	},
	{
		path: '/amoe',
		component: <AMOE />,
		modules: [modules.amoe],
		operation: 'R',
	},
	{
		path: '/amoe/update-settings',
		component: <UpdateAMOE />,
		modules: [modules.amoe],
		operation: 'R',
	},
	{
		path: '/spin-wheel',
		component: <SpinWheelListing />,
		modules: [modules.spinWheelConfiguration],
		operation: 'R',
	},
	{
		path: '/vip',
		component: <VIPtiers />,
		modules: [modules.vip],
		operation: 'R',
	},
	{
		path: '/vip/add',
		component: <CreateVip />,
		modules: [modules.vip],
		operation: 'C',
	},
	{
		path: '/vip/edit/:vipId',
		component: <UpdateVip />,
		modules: [modules.vip],
		operation: 'U',
	},
	{
		path: '/vip/details/:vipId',
		component: <VipProviderView />,
		modules: [modules.vip],
		operation: 'U',
	},
	{
		path: '/states',
		component: <StatesList />,
		modules: [modules.applicationSetting],
	},
	{
		path: '/coins',
		component: <CurrencyList />,
		// modules: [modules.bonus],
	},
	{
		path: '/banner/:bannerId',
		component: <UpdateBanner />,
		modules: [modules.banner],
	},
	{
		path: '/banner/view/:bannerId',
		component: <UpdateBanner isView />,
		modules: [modules.banner],
	},
	// {
	// 	path: '/seo-slugs',
	// 	component: <MetaTags />,
	// 	modules: [modules.seoPage],
	// 	operation: 'R',
	// },
	// {
	// 	path: '/seo-slug/:id',
	// 	component: <ViewSeoRouteDetails />,
	// 	modules: [modules.seoPage],
	// 	operation: 'R',
	// },
	{
		path: '/segmentation/create',
		component: <CreateSegmentation />,
		modules: [modules.segmentation],
		operation: 'R',
	},
	{
		path: '/segmentation/edit/:segmentationId',
		component: <EditSegmentation />,
		modules: [modules.segmentation],
		operation: 'R',
	},
	{
		path: '/segmentation/view/:segmentationId',
		component: <SegmentationDetails />,
		modules: [modules.segmentation],
		operation: 'R',
	},
	{
		path: '/advance-filter',
		component: <AdvanceFilter />,
		modules: [modules.player],
		operation: 'R',
	},
	{
		path: '/advance-filter/view',
		component: <AdvanceFilterListing />,
		modules: [modules.player],
		operation: 'R',
	},
	{
		path: '/testimonials',
		component: <Testimonial />,
		modules: [modules.testimonial],
		operation: 'R',
	},
	{
		path: '/testimonials/create',
		component: <CreateTestimonial />,
		modules: [modules.testimonial],
		operation: 'C',
	},
	{
		path: '/testimonials/edit/:id',
		component: <EditTestimonial />,
		modules: [modules.testimonial],
		operation: 'U',
	},
	{
		path: '/testimonials/view/:id',
		component: <TestimonialDetail />,
		modules: [modules.testimonial],
		operation: 'R',
	},

	{ path: '*', component: <DashboardView /> },
];

const publicRoutes = [{ path: '/login', component: <LoginRight /> }];

export { authProtectedRoutes, publicRoutes };
