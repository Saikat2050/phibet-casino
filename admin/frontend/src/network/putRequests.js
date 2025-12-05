import { putRequest } from './axios';
import { API_NAMESPACE, MANAGEMENT } from './networkUtils';

const { VITE_APP_API_URL } = import.meta.env;

const updateStatus = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SPORTS}status`,
		data
	);

const updateGlobalRegistration = (data) =>
	putRequest(`${VITE_APP_API_URL}${API_NAMESPACE}/global-registration`, data);

const editBetSettings = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/sportsbook/bet-settings`,
		data
	);

const updateloyaltyLevel = ({ data }) =>
	putRequest(`${VITE_APP_API_URL}${API_NAMESPACE}/bonus/loyalty-level`, data);

const markUserAsInternal = (data) =>
	putRequest(`${VITE_APP_API_URL}${API_NAMESPACE}/user/internal`, data);

const cancelDocumentRequest = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/user/cancel-document-request`,
		data
	);

const cancelBonus = (data) =>
	putRequest(`${VITE_APP_API_URL}${API_NAMESPACE}/bonus/cancel`, data);

const verifyUserDocument = (data) =>
	putRequest(`${VITE_APP_API_URL}${API_NAMESPACE}/user/verify-document`, data);

const updateOddsVariationApi = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/sportsbook/odd-settings`,
		data
	);

const detachOddsVariationApi = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/sportsbook/detach-market`,
		data
	);

const updateCompanyOddApi = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/sportsbook/custom-odds`,
		data
	);

const addRestrictedItems = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.COUNTRY}restricted`,
		data
	);

const updateReview = ({ data }) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.ADMIN}review`,
		data
	);

const updateChannel = (data) =>
	putRequest(`${VITE_APP_API_URL}${API_NAMESPACE}update-group`, data);

const updatePaymentProvider = (data) =>
	putRequest(`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PAYMENT}`, data, {
		'Content-Type': 'multipart/form-data',
	});

const editVIPTier = (data) =>
	putRequest(`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.VIP}`, data, {
		// 'Content-Type': 'multipart/form-data',
	});

const addProviderRestrictedCountries = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}restrict-countries-for-provider`,
		data
	);

const addGamesRestrictedCountries = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}restrict-countries-for-game`,
		data
	);

const addProviderRestrictedStates = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}restrict-states-for-provider`,
		data
	);

const removeRestrictedStatesProvider = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}remove-restricted-states-for-provider`,
		data
	);

const addGamesRestrictedStates = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}restrict-states-for-game`,
		data
	);

const removeRestrictedStatesGame = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}remove-restricted-states-for-game`,
		data
	);

const removeRestrictedCountriesProvider = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}remove-restricted-countries-for-provider`,
		data
	);

const removeRestrictedCountriesGame = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}remove-restricted-countries-for-game`,
		data
	);

const isCasinoFeaturedService = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}toggle-featured-game`,
		data
	);

const isCasinoLandingGameService = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}toggle-landing-page-game`,
		data
	);

const casinoManagementToggle = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}toggle`,
		data
	);

const editCasinoCategory = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}category`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const updateCategoryReOrder = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}reorder-category`,
		data
	);

const updateReorderGames = ({ data }) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}reorder-games`,
		data
	);

const editCasinoGames = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}game`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const editCasinoProvider = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}provider`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const removeGamesFromCategory = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}remove-games-from-category`,
		data
	);

const updateReorderProviders = ({ data }) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}reorder-providers`,
		data
	);

const updateStateStatus = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SETTINGS}state/toggle`,
		data
	);

const updateSpinWheelRequests = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}spin-wheel/update-config`,
		data
	);

const updateAmoe = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.AMOE}address`,
		data
	);

const verifyPlayerKyc = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}kyc/verify`,
		data
	);

const updateSeoRoute = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/content-management/seo/page`,
		data
	);

const updateSegmentationRequest = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}segment`,
		data
	);

const updateEmailTemplate = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}email-template`,
		data
	);

const updateTestimonial = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}testimonial`,
		data
	);

const resetUserProfileLimitCall = (data) =>
	putRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}reset/profile-limit`,
		data
	);

export {
	updateSegmentationRequest,
	updateStatus,
	updateGlobalRegistration,
	editBetSettings,
	updateloyaltyLevel,
	markUserAsInternal,
	cancelDocumentRequest,
	cancelBonus,
	verifyUserDocument,
	updateOddsVariationApi,
	detachOddsVariationApi,
	updateCompanyOddApi,
	addRestrictedItems,
	updateReview,
	updateChannel,
	updatePaymentProvider,
	editVIPTier,
	isCasinoFeaturedService,
	isCasinoLandingGameService,
	casinoManagementToggle,
	editCasinoCategory,
	updateCategoryReOrder,
	updateReorderGames,
	addProviderRestrictedCountries,
	addGamesRestrictedCountries,
	removeRestrictedCountriesProvider,
	removeRestrictedCountriesGame,
	editCasinoGames,
	editCasinoProvider,
	removeGamesFromCategory,
	updateReorderProviders,
	addProviderRestrictedStates,
	addGamesRestrictedStates,
	removeRestrictedStatesGame,
	removeRestrictedStatesProvider,
	updateStateStatus,
	updateSpinWheelRequests,
	updateAmoe,
	verifyPlayerKyc,
	updateSeoRoute,
	updateEmailTemplate,
	updateTestimonial,
	resetUserProfileLimitCall
};
