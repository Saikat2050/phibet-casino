import { all, fork } from 'redux-saga/effects';
import AuthSaga from './auth/login/saga';
import LayoutSaga from './layout/saga';
import CountriesSaga from './countries/saga';
import AdminRoles from './auth/roles/saga';
import PermissionDetails from './auth/permissionDetails/saga';
import PlayerSaga from './players/saga';
import AdminDetailsSaga from './admins/saga';
import CmsDetailsSaga from './cms/saga';
import aggregatorsSaga from './aggregators/saga';
import BonusDetailsSaga from './bonusListing/saga';
import LanguagesSaga from './languages/saga';
import CurrenciesSaga from './currencies/saga';
import LanguageManagementSaga from './languageManagement/saga';
import BetSettingsSaga from './betSettings/saga';
import TransactionBankingSaga from './transactionBanking/saga';
import sportsBookSaga from './sportsBook/saga';
import ReviewManagementSaga from './reviewManagement/saga';
import SportsBetSaga from './sportsBet/saga';
import CasinoManagementSaga from './casinoManagement/saga';
import CasinoTransactionsSaga from './casinoTransactions/saga';
import WithdrawRequestsSaga from './withdrawRequests/saga';
import SASettingsSaga from './superAdminSettings/saga';
import SportsMatchesSaga from './sportsMatches/saga';
import adminUserWatcher from './adminUser/saga';
import SportsMarkets from './sportsMarkets/saga';
import EmailTemplateSaga from './emailTemplate/saga';
import WageringTemplateDetailsSaga from './wageringTemplate/saga';
import ProfileDataSaga from './profile/saga';
import GlobalRegistrationSaga from './registrationformFiels/saga';
import DashboardViewSaga from './dashboardView/saga';
import UserDetailsSaga from './userDetails/saga';
import RestrictedCountriesSaga from './restrictedCountries/saga';
import CreateUpdateBonusSaga from './createUpdateBonus/saga';
import SportsTransactionsSaga from './sportsTransactions/saga';
import GameTransactionSaga from './gameTransactions/saga';
import PlayerPerformanceSaga from './playerPerformance/saga';
import TournamentSaga from './tournaments/saga';
import PaymentSaga from './payment/saga';
import NotificationSaga from './notifications/saga';
import AllReferralsSaga from './allReferrals/saga';
import DisputeSaga from './disputeResolution/saga';
import ChannelSaga from './channel/saga';
import ChatrainSaga from './chatRain/saga';
import PackagesSaga from './packages/saga';
import AmoeSaga from './amoe/saga';
import spinWheelSaga from './spinWheel/saga';
import VIPTiersSaga from './vip/saga';
import States from './states/saga';
import RestrictedStates from './restrictedStates/saga';
import SeoDataSaga from './seo/saga';
import Segmentation from './segmentation/saga';
import advanceFilterSaga from './advanceFilter/saga';
import TestimonialSaga from './testimonials/saga';
import adminActivitySaga from './adminActivity/saga';

export default function* rootSaga() {
	yield all([
		fork(AdminRoles),
		fork(CountriesSaga),
		fork(AuthSaga),
		fork(PermissionDetails),
		fork(PlayerSaga),
		fork(CmsDetailsSaga),
		fork(BonusDetailsSaga),
		fork(LanguagesSaga),
		fork(CurrenciesSaga),
		fork(LanguageManagementSaga),
		fork(BetSettingsSaga),
		fork(TransactionBankingSaga),
		fork(sportsBookSaga),
		fork(ReviewManagementSaga),
		fork(SportsBetSaga),
		fork(CasinoManagementSaga),
		fork(CasinoTransactionsSaga),
		fork(SportsTransactionsSaga),
		fork(WithdrawRequestsSaga),
		fork(SASettingsSaga),
		fork(SportsMatchesSaga),
		fork(adminUserWatcher),
		fork(SportsMarkets),
		fork(EmailTemplateSaga),
		fork(WageringTemplateDetailsSaga),
		fork(ProfileDataSaga),
		fork(GlobalRegistrationSaga),
		fork(UserDetailsSaga),
		fork(RestrictedCountriesSaga),
		fork(LayoutSaga),
		fork(AdminDetailsSaga),
		fork(aggregatorsSaga),
		fork(DashboardViewSaga),
		fork(CreateUpdateBonusSaga),
		fork(GameTransactionSaga),
		fork(PlayerPerformanceSaga),
		fork(TournamentSaga),
		fork(PaymentSaga),
		fork(NotificationSaga),
		fork(AllReferralsSaga),
		fork(DisputeSaga),
		fork(ChannelSaga),
		fork(ChatrainSaga),
		fork(PackagesSaga),
		fork(AmoeSaga),
		fork(spinWheelSaga),
		fork(VIPTiersSaga),
		fork(States),
		fork(RestrictedStates),
		fork(SeoDataSaga),
		fork(Segmentation),
		fork(advanceFilterSaga),
		fork(TestimonialSaga),
		fork(adminActivitySaga),
	]);
}
