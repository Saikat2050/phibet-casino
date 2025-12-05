import { postRequest } from './axios';
import { MANAGEMENT } from './networkUtils';

const { VITE_APP_API_URL } = import.meta.env;
const API_NAMESPACE = '/api/v1';

const superAdminLogin = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.ADMIN}login`,
		data
	);

const createCurrency = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SETTINGS}currency/create`,
		data
	);

const updateCurrency = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SETTINGS}currency/update`,
		data
	);
const editCountryDetails = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SETTINGS}country/update`,
		data
	);

const updateCurrencyStatus = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SETTINGS}currency/toggle`,
		data
	);

const updateCountryStatus = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SETTINGS}country/toggle`,
		data
	);

const addSuperAdminUser = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.ADMIN}create-user`,
		data
	);

const createAggregator = (data) =>
	postRequest(`${VITE_APP_API_URL}${API_NAMESPACE}/casino/aggregator`, data);

const createCasinoProvider = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}create-provider`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const createReview = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.ADMIN}review`,
		data
	);

const createBetSettings = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/sportsbook/bet-settings`,
		data
	);

const editBanner = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}banner/upload`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const createCasinoCategory = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}category`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const createKYCLabels = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}/kyc/document-label/create`,
		data
	);

const createUserCommentEntry = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}player/create-comment`,
		data
	);

const createWageringTemplate = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.BONUS}wagering-template/create
	`,
		data
	);

const updateWageringTemplate = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.BONUS}wagering-template/update`,
		data
	);

const resetUserLimitCall = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}limit/update-betting`,
		data
	);

const resetDepositLimitCall = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}limit/update-deposit-and-loss`,
		data
	);

const disableUserCall = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}limit/update-self-exclusion`,
		data
	);

const disableUserSession = (data) =>
	postRequest(`${VITE_APP_API_URL}${API_NAMESPACE}/user/session-time`, data);

const createSuperAdminCMS = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}page/create`,
		data
	);

const updateMatchFeaturedTemplate = (data) =>
	postRequest(`${VITE_APP_API_URL}admin/sportsbook/addFeatured`, data);

const issueBonus = (data) =>
	postRequest(`${VITE_APP_API_URL}${API_NAMESPACE}/bonus/issue`, data);

const testEmailTemplateEndPoint = (data) =>
	postRequest(`${VITE_APP_API_URL}${API_NAMESPACE}/email/test`, data);

const createEmailTemplate = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}email-template`,
		data
	);

const addGamesToCategory = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CASINO}add-games-to-category`,
		data
	);

const createBonusCall = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.BONUS}bonus/create`,
		data,
		{}
	);

const uploadGallery = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}gallery/upload`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const updateProfile = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.ADMIN}update-profile`,
		data
	);

const resetProfilePassword = ({ data }) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.ADMIN}change-password`,
		data
	);

const superAdminViewToggleStatus = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.ADMIN}toggle-child`,
		data
	);

const updateKYCLabels = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}/kyc/document-label/update`,
		data
	);

const updateSAUserStatusCall = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}player/toggle`,
		data
	);

const createUserTags = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}tag/create`,
		data
	);

const attachUserTags = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}tag/attach-tag`,
		data
	);

const removeUserTags = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}tag/remove-tag`,
		data
	);

const updatePageStatus = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}page/toggle`,
		data
	);

const updateUserInfoCall = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}player/update`,
		data
	);

const updateUserPassword = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}player/update-password`,
		data
	);

const addDepositToOtherCall = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}wallet`,
		data
	);

const resetPasswordEmail = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}player/reset-password`,
		data
	);

const verifyPlayerEmail = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}kyc/verify-email`,
		data
	);

const updateAdmin = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.ADMIN}update-child`,
		data
	);

const updateSportStatus = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SPORTS}toggle-sport`,
		data
	);

const updateLocationStatus = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SPORTS}toggle-location`,
		data
	);

const requestDocument = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}kyc/request-document`,
		data
	);

const verifyDocument = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}kyc/verify-document`,
		data
	);

const rejectDocumentCall = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}kyc/reject-document`,
		data
	);

const updateSuperAdminCMS = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}page/update`,
		data
	);

// const updateEmailTemplate = (data) =>
// 	postRequest(
// 		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}email-template`,
// 		data
// 	);

const primaryEmailTemplate = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}email-template/set-default`,
		data
	);

const updateSiteConfiguration = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SETTINGS}application/update-constants`,
		data
	);

const uploadLogoRequest = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SETTINGS}application/update-logo`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const updateAppSettingRequest = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SETTINGS}application/toggle`,
		data
	);

const updateLimitsRequest = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SETTINGS}application/update-value-comparisons`,
		data
	);

const updateSiteDetails = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.ADMIN}update-site-layout`,
		data
	);

const uploadImageApi = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SPORTS}upload-sport-icon`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const uploadSportsCountryImageApi = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.SPORTS}upload-location-icon`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const activateKyc = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}kyc/activate`,
		data
	);

const inActiveKyc = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}kyc/inactive`,
		data
	);

const updateComment = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}player/update-comment`,
		data
	);

const reorderBonus = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.BONUS}bonus/reorder`,
		data
	);

const toggleBonusStatus = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.BONUS}bonus/toggle`,
		data
	);

const updateBonusCall = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.BONUS}bonus/update`,
		data,
		{}
	);

const createTournament = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.TOURNAMENT}/create`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const updateTournament = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.TOURNAMENT}/update`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const updateTournamentStatus = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.TOURNAMENT}/toggle`,
		data
	);

const createPaymentProvider = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PAYMENT}`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);
const updateTournamentSettlement = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.TOURNAMENT}/settlement`,
		data
	);

const cancelTournament = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.TOURNAMENT}/cancel`,
		data
	);

// const updatePaymentProvider = (data) =>
// 	postRequest(
// 		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PAYMENT}update`,
// 		data,
// 		{
// 			'Content-Type': 'multipart/form-data',
// 		}
// 	);

const updateReferralRequest = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.BONUS}referral/update`,
		data
	);

const notifyPlayersRequest = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}notification/create`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const sendMessageRequest = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/crm${MANAGEMENT.DISPUTE}reply-message`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

const updateStatus = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/crm${MANAGEMENT.DISPUTE}update-status`,
		data
	);

const createChannel = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CHAT}create-group`,
		data
	);
const createChatrain = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CHAT}create-chat-rain`,
		data
	);

const updateChatrain = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CHAT}update-chat-rain`,
		data
	);

const addProviderCredentials = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.INTERNAL}create-credentials`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);
const updateProviderCredentials = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.INTERNAL}update-credentials`,
		data,
		{
			'Content-Type': 'multipart/form-data',
		}
	);
const updateUserTags = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}tag/update-tag`,
		data
	);

const addPackage = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.STORE}create-package`,
		data,
		{
			// 'Content-Type': 'multipart/form-data',
		}
	);

const updatePackage = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.STORE}update-package`,
		data,
		{
			// 'Content-Type': 'multipart/form-data',
		}
	);

const reorderPackage = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.STORE}reorder-package`,
		data
	);

const statusAmoe = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.AMOE}manage`,
		data
	);

const createVIPTier = (data) =>
	postRequest(`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.VIP}`, data, {
		// 'Content-Type': 'multipart/form-data',
	});

const postApproveRejectWithdrawalRequests = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PAYMENT}withdrawal`,
		data
	);

const verifyPlayerPhone = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}kyc/verify-phone`,
		data
	);

const createSeoRoute = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}/content-management/seo/page`,
		data
	);

const createSegmentationRequest = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}segment`,
		data
	);

const applyAdvanceFilterRequest = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.PLAYER}segment-advance-filter`,
		data
	);

const createTestimonialRequest = (data) =>
	postRequest(
		`${VITE_APP_API_URL}${API_NAMESPACE}${MANAGEMENT.CONTENT}testimonial`,
		data
	);


export {
	createSuperAdminCMS,
	superAdminLogin,
	createCurrency,
	updateCurrency,
	editCountryDetails,
	addSuperAdminUser,
	createAggregator,
	createCasinoProvider,
	createReview,
	createBetSettings,
	editBanner,
	createCasinoCategory,
	createKYCLabels,
	createUserCommentEntry,
	createWageringTemplate,
	resetUserLimitCall,
	disableUserCall,
	disableUserSession,
	updateMatchFeaturedTemplate,
	issueBonus,
	resetDepositLimitCall,
	testEmailTemplateEndPoint,
	createEmailTemplate,
	addGamesToCategory,
	createBonusCall,
	uploadGallery,
	updateProfile,
	resetProfilePassword,
	superAdminViewToggleStatus,
	updateKYCLabels,
	updateCurrencyStatus,
	updateCountryStatus,
	updateSAUserStatusCall,
	attachUserTags,
	removeUserTags,
	updatePageStatus,
	updateUserInfoCall,
	updateUserPassword,
	addDepositToOtherCall,
	resetPasswordEmail,
	verifyPlayerEmail,
	updateAdmin,
	updateSportStatus,
	updateLocationStatus,
	requestDocument,
	verifyDocument,
	rejectDocumentCall,
	updateSuperAdminCMS,
	// updateEmailTemplate,
	primaryEmailTemplate,
	updateSiteConfiguration,
	uploadLogoRequest,
	updateAppSettingRequest,
	updateLimitsRequest,
	updateSiteDetails,
	uploadImageApi,
	uploadSportsCountryImageApi,
	createUserTags,
	activateKyc,
	inActiveKyc,
	updateComment,
	updateWageringTemplate,
	reorderBonus,
	toggleBonusStatus,
	updateBonusCall,
	createTournament,
	updateTournament,
	updateTournamentStatus,
	createPaymentProvider,
	updateTournamentSettlement,
	cancelTournament,
	// updatePaymentProvider,
	updateReferralRequest,
	notifyPlayersRequest,
	sendMessageRequest,
	updateStatus,
	createChannel,
	createChatrain,
	updateChatrain,
	addProviderCredentials,
	updateProviderCredentials,
	updateUserTags,
	addPackage,
	updatePackage,
	reorderPackage,
	statusAmoe,
	createVIPTier,
	postApproveRejectWithdrawalRequests,
	verifyPlayerPhone,
	createSeoRoute,
	createSegmentationRequest,
	applyAdvanceFilterRequest,
	createTestimonialRequest
};
