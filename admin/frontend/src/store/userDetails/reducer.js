import { keyBy } from 'lodash';
import {
	ATTACH_TAG,
	ATTACH_TAG_FAIL,
	ATTACH_TAG_SUCCESS,
	CANCEL_USER_BONUS,
	CANCEL_USER_BONUS_FAIL,
	CANCEL_USER_BONUS_SUCCESS,
	CREATE_USER_COMMENT,
	CREATE_USER_COMMENT_FAIL,
	CREATE_USER_COMMENT_SUCCESS,
	DEPOSIT_TO_OTHER,
	DEPOSIT_TO_OTHER_FAIL,
	DEPOSIT_TO_OTHER_SUCCESS,
	DISABLE_USER,
	DISABLE_USER_FAIL,
	DISABLE_USER_SUCCESS,
	GET_ALL_BONUS,
	GET_ALL_BONUS_FAIL,
	GET_ALL_BONUS_SUCCESS,
	GET_ALL_TAGS,
	GET_ALL_TAGS_FAIL,
	GET_ALL_TAGS_SUCCESS,
	GET_BONUS_DETAILS,
	GET_BONUS_DETAILS_FAIL,
	GET_BONUS_DETAILS_RESET,
	GET_BONUS_DETAILS_SUCCESS,
	GET_DUPLICATE_USERS,
	GET_DUPLICATE_USERS_FAIL,
	GET_DUPLICATE_USERS_SUCCESS,
	GET_USER_BONUS,
	GET_USER_BONUS_FAIL,
	GET_USER_BONUS_SUCCESS,
	GET_USER_COMMENTS,
	GET_USER_COMMENTS_FAIL,
	GET_USER_COMMENTS_SUCCESS,
	GET_USER_DETAILS,
	GET_USER_DETAILS_FAIL,
	GET_USER_DETAILS_SUCCESS,
	GET_USER_DOCUMENTS,
	GET_USER_DOCUMENTS_FAIL,
	GET_USER_DOCUMENTS_SUCCESS,
	ISSUE_BONUS,
	ISSUE_BONUS_FAIL,
	ISSUE_BONUS_SUCCESS,
	MARK_USER_AS_INTERNAL,
	MARK_USER_AS_INTERNAL_FAIL,
	MARK_USER_AS_INTERNAL_SUCCESS,
	REMOVE_TAG,
	REMOVE_TAG_FAIL,
	REMOVE_TAG_SUCCESS,
	RESET_USER_DETAILS,
	RESET_USER_LIMIT,
	RESET_USER_LIMIT_DATA,
	RESET_USER_LIMIT_FAIL,
	RESET_USER_LIMIT_SUCCESS,
	UPDATE_USER_COMMENT,
	UPDATE_USER_COMMENT_FAIL,
	UPDATE_USER_COMMENT_SUCCESS,
	SEND_PASSWORD_RESET,
	SEND_PASSWORD_RESET_FAIL,
	SEND_PASSWORD_RESET_SUCCESS,
	UPDATE_SA_USER_STATUS,
	UPDATE_SA_USER_STATUS_FAIL,
	UPDATE_SA_USER_STATUS_SUCCESS,
	UPDATE_USER_INFO,
	UPDATE_USER_INFO_FAIL,
	UPDATE_USER_INFO_SUCCESS,
	UPDATE_USER_PASSWORD,
	UPDATE_USER_PASSWORD_FAIL,
	UPDATE_USER_PASSWORD_SUCCESS,
	VERIFY_USER_EMAIL,
	VERIFY_USER_EMAIL_FAIL,
	VERIFY_USER_EMAIL_SUCCESS,
	REQUEST_DOCUMENT,
	REQUEST_DOCUMENT_SUCCESS,
	REQUEST_DOCUMENT_FAIL,
	VERIFY_DOCUMENT,
	VERIFY_DOCUMENT_SUCCESS,
	VERIFY_DOCUMENT_FAIL,
	REJECT_DOCUMENT,
	REJECT_DOCUMENT_SUCCESS,
	REJECT_DOCUMENT_FAIL,
	CREATE_TAG,
	CREATE_TAG_SUCCESS,
	CREATE_TAG_FAIL,
	ACTIVATE_KYC,
	ACTIVATE_KYC_SUCCESS,
	ACTIVATE_KYC_FAIL,
	INACTIVE_KYC,
	INACTIVE_KYC_SUCCESS,
	INACTIVE_KYC_FAIL,
	DELETE_USER_COMMENT_SUCCESS,
	DELETE_USER_COMMENT_FAIL,
	DELETE_USER_COMMENT,
	USER_REFERRALS_SUCCESS,
	USER_REFERRALS,
	USER_REFERRALS_FAIL,
	DELETE_TAG_SUCCESS,
	DELETE_TAG_FAIL,
	DELETE_TAG,
	UPDATE_TAG,
	UPDATE_TAG_SUCCESS,
	UPDATE_TAG_FAIL,
	VERIFY_USER_PHONE,
	VERIFY_USER_PHONE_SUCCESS,
	VERIFY_USER_PHONE_FAIL,
	VERIFY_USER_KYC,
	VERIFY_USER_KYC_SUCCESS,
	VERIFY_USER_KYC_FAIL,
	RESET_USER_PROFILE_UPDATE_LIMIT,
	RESET_USER_PROFILE_UPDATE_LIMIT_SUCCESS,
	RESET_USER_PROFILE_UPDATE_LIMIT_FAIL,
} from './actionTypes';
// import { verifyUserPhoneSuccess } from './actions';

const INIT_STATE = {
	userDetails: null,
	userStatsData: null,
	userWalletData: null,
	userDetailsLoading: false,
	userDetailsError: false,
	userDocuments: null,
	userDocumentsLoading: false,
	userDocumentsError: false,
	userBonus: null,
	userBonusLoading: false,
	userBonusError: false,
	userComments: null,
	userCommentsLoading: false,
	userCommentsError: false,
	createUserCommentsSuccess: false,
	createUserCommentsLoading: false,
	createUserCommentsError: false,
	resetUserLimitSuccess: false,
	resetUserLimitLoading: false,
	resetUserLimitError: false,
	disableUserSuccess: false,
	disableUserLoading: false,
	disableUserError: false,
	updateSAUserStatusSuccess: false,
	updateSAUserStatusLoading: false,
	updateSAUserStatusError: false,
	markUserAsInternalLoading: false,
	markUserAsInternalSuccess: false,
	markUserAsInternalError: false,
	verifyUserEmailLoading: false,
	verifyUserEmailSuccess: false,
	verifyUserEmailError: false,

	verifyUserPhoneLoading: false,
	verifyUserPhoneSuccess: false,
	verifyUserPhoneError: false,

	updateUserTagsLoading: false,
	updateUserTagsSuccess: false,
	updateUserTagsError: false,
	getDuplicateUsersLoading: false,
	duplicateUsers: false,
	getDuplicateUsersError: false,
	getAllBonusLoading: false,
	bonusList: [],
	getAllBonusError: false,
	getBonusDetailsLoading: false,
	bonusDetails: null,
	bonusSegment: null,
	getBonusDetailsError: false,
	issueBonusLoading: false,
	issueBonusSuccess: false,
	issueBonusError: false,
	depositToOtherLoading: false,
	depositToOtherSuccess: false,
	depositToOtherError: false,
	updateUserInfoLoading: false,
	updateUserInfoSuccess: false,
	updateUserInfoError: false,
	sendPasswordResetError: false,
	sendPasswordResetLoading: false,
	sendPasswordResetSuccess: false,
	updateUserPasswordLoading: false,
	updateUserPasswordSuccess: false,
	updateUserPasswordError: false,
	cancelUserBonusLoading: false,
	cancelUserBonusSuccess: false,
	cancelUserBonusError: false,
	updateUserCommentError: false,
	updateUserCommentLoading: false,
	updateUserCommentSuccess: false,
	deleteUserCommentError: false,
	deleteUserCommentLoading: false,
	deleteUserCommentSuccess: false,
	attachTag: false,
	attachTagLoading: false,
	attachTagError: null,
	userTags: null,
	userTagsById: {},
	userTagsLoading: false,
	userTagsError: null,
	removeUserTag: false,
	removeUserTagLoading: false,
	removeUserTagError: null,
	requestDocument: null,
	requestDocumentLoading: false,
	requestDocumentError: null,
	verifyDocument: null,
	verifyDocumentLoading: false,
	verifyDocumentError: null,
	rejectDocument: null,
	rejectDocumentLoading: false,
	rejectDocumentError: null,
	createTagLoading: false,
	createTag: false,
	createTagError: null,
	activeKycLoading: false,
	activeKyc: null,
	activeKycError: null,
	inActiveKycLoading: false,
	inActiveKyc: null,
	inActiveKycError: null,
	referralsLoading: false,
	referrals: null,
	referralsError: null,
	deleteTagLoading: false,
	updateTagLoading: false,
	verifyUserKycLoading: false,
	verifyUserKycSuccess: false,
	verifyUserKycError: false,
	resetUpdateProfileLimitLoading: false,
	resetUpdateProfileLimitSuccess: false,
	resetUpdateProfileLimitError: null,
};

const UserDetails = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_USER_DETAILS:
			return {
				...state,
				userDetailsLoading: true,
				userDetails: null,
				userDetailsError: null,
			};

		case GET_USER_DETAILS_SUCCESS:
			return {
				...state,
				userDetailsLoading: false,
				userDetails: payload?.user,
				userWalletData: payload?.user?.getUserWalletData,
				userStatsData: payload?.playerStats?.[0],
				userDetailsError: null,
			};

		case GET_USER_DETAILS_FAIL:
			return {
				...state,
				userDetailsError: payload,
				userDetailsLoading: true,
			};

		case RESET_USER_DETAILS:
			return INIT_STATE;

		case GET_USER_DOCUMENTS:
			return {
				...state,
				userDocumentsLoading: true,
			};

		case GET_USER_DOCUMENTS_SUCCESS:
			return {
				...state,
				userDocumentsLoading: false,
				userDocuments: payload,
				userDocumentsError: null,
			};

		case GET_USER_DOCUMENTS_FAIL:
			return {
				...state,
				userDocumentsError: payload,
				userDocumentsLoading: true,
			};

		case GET_USER_BONUS:
			return {
				...state,
				userBonusLoading: true,
			};

		case GET_USER_BONUS_SUCCESS:
			return {
				...state,
				userBonusLoading: false,
				userBonus: payload,
				userBonusError: null,
			};

		case GET_USER_BONUS_FAIL:
			return {
				...state,
				userBonusError: payload,
				userBonusLoading: true,
			};

		case GET_USER_COMMENTS:
			return {
				...state,
				userCommentsLoading: true,
			};

		case GET_USER_COMMENTS_SUCCESS:
			return {
				...state,
				userCommentsLoading: false,
				userComments: payload,
				userCommentsError: null,
			};

		case GET_USER_COMMENTS_FAIL:
			return {
				...state,
				userCommentsError: payload,
				userCommentsLoading: true,
			};

		case CREATE_USER_COMMENT:
			return {
				...state,
				createUserCommentsLoading: true,
				createUserCommentsSuccess: false,
				createUserCommentsError: null,
			};

		case CREATE_USER_COMMENT_SUCCESS:
			return {
				...state,
				createUserCommentsLoading: false,
				createUserCommentsSuccess: true,
				createUserCommentsError: null,
			};

		case CREATE_USER_COMMENT_FAIL:
			return {
				...state,
				createUserCommentsError: payload,
				createUserCommentsLoading: false,
				createUserCommentsSuccess: false,
			};

		case RESET_USER_LIMIT:
			return {
				...state,
				resetUserLimitLoading: true,
			};

		case RESET_USER_LIMIT_SUCCESS:
			return {
				...state,
				resetUserLimitLoading: false,
				resetUserLimitSuccess: true,
				resetUserLimitError: null,
			};

		case RESET_USER_LIMIT_FAIL:
			return {
				...state,
				resetUserLimitError: payload,
				resetUserLimitLoading: true,
				resetUserLimitSuccess: false,
			};

		case RESET_USER_LIMIT_DATA:
			return {
				...state,
				resetUserLimitSuccess: false,
				resetUserLimitLoading: false,
				resetUserLimitError: false,
				disableUserError: false,
				disableUserLoading: false,
				disableUserSuccess: false,
				updateUserTagsLoading: false,
				updateUserTagsSuccess: false,
				updateUserTagsError: false,
				updateSAUserStatusSuccess: false,
			};

		case DISABLE_USER:
			return {
				...state,
				disableUserLoading: true,
			};

		case DISABLE_USER_SUCCESS:
			return {
				...state,
				disableUserLoading: false,
				disableUserSuccess: true,
				disableUserError: null,
			};

		case DISABLE_USER_FAIL:
			return {
				...state,
				disableUserError: payload,
				disableUserLoading: true,
				disableUserSuccess: false,
			};

		case UPDATE_SA_USER_STATUS:
			return {
				...state,
				updateSAUserStatusLoading: true,
				updateSAUserStatusSuccess: false,
				updateSAUserStatusError: null,
			};

		case UPDATE_SA_USER_STATUS_SUCCESS:
			return {
				...state,
				updateSAUserStatusLoading: false,
				updateSAUserStatusSuccess: true,
				updateSAUserStatusError: null,
			};

		case UPDATE_SA_USER_STATUS_FAIL:
			return {
				...state,
				updateSAUserStatusError: payload,
				updateSAUserStatusLoading: false,
				updateSAUserStatusSuccess: false,
			};

		case MARK_USER_AS_INTERNAL:
			return {
				...state,
				markUserAsInternalLoading: true,
			};

		case MARK_USER_AS_INTERNAL_SUCCESS:
			return {
				...state,
				markUserAsInternalLoading: false,
				markUserAsInternalSuccess: true,
				markUserAsInternalError: null,
			};

		case MARK_USER_AS_INTERNAL_FAIL:
			return {
				...state,
				markUserAsInternalError: payload,
				markUserAsInternalLoading: false,
				markUserAsInternalSuccess: false,
			};

		case VERIFY_USER_EMAIL:
			return {
				...state,
				verifyUserEmailLoading: true,
			};

		case VERIFY_USER_EMAIL_SUCCESS:
			return {
				...state,
				verifyUserEmailLoading: false,
				verifyUserEmailSuccess: true,
				verifyUserEmailError: null,
			};

		case VERIFY_USER_EMAIL_FAIL:
			return {
				...state,
				verifyUserEmailError: payload,
				verifyUserEmailLoading: false,
				verifyUserEmailSuccess: false,
			};

		case VERIFY_USER_PHONE:
			return {
				...state,
				verifyUserPhoneLoading: true,
			};

		case VERIFY_USER_PHONE_SUCCESS:
			return {
				...state,
				verifyUserPhoneLoading: false,
				verifyUserPhoneSuccess: true,
				verifyUserPhoneError: null,
			};

		case VERIFY_USER_PHONE_FAIL:
			return {
				...state,
				verifyUserPhoneError: payload,
				verifyUserPhoneLoading: false,
				verifyUserPhoneSuccess: false,
			};

		case GET_DUPLICATE_USERS:
			return {
				...state,
				getDuplicateUsersLoading: true,
			};

		case GET_DUPLICATE_USERS_SUCCESS:
			return {
				...state,
				getDuplicateUsersLoading: false,
				duplicateUsers: payload,
				getDuplicateUsersError: null,
			};

		case GET_DUPLICATE_USERS_FAIL:
			return {
				...state,
				getDuplicateUsersError: payload,
				getDuplicateUsersLoading: false,
				duplicateUsers: false,
			};

		case GET_ALL_BONUS:
			return {
				...state,
				getAllBonusLoading: true,
			};

		case GET_ALL_BONUS_SUCCESS:
			return {
				...state,
				getAllBonusLoading: false,
				bonusList: payload,
				getAllBonusError: null,
			};

		case GET_ALL_BONUS_FAIL:
			return {
				...state,
				getAllBonusError: payload,
				getAllBonusLoading: false,
				bonusList: false,
			};

		case GET_BONUS_DETAILS:
			return {
				...state,
				getBonusDetailsLoading: true,
			};

		case GET_BONUS_DETAILS_SUCCESS:
			return {
				...state,
				getBonusDetailsLoading: false,
				bonusDetails: payload?.bonus,
				bonusSegment: payload?.tags,
				getBonusDetailsError: null,
			};

		case GET_BONUS_DETAILS_RESET:
			return {
				...state,
				getBonusDetailsLoading: false,
				bonusDetails: null,
				getBonusDetailsError: false,
			};

		case GET_BONUS_DETAILS_FAIL:
			return {
				...state,
				getBonusDetailsError: payload,
				getBonusDetailsLoading: false,
				bonusDetails: false,
			};

		case ISSUE_BONUS:
			return {
				...state,
				issueBonusLoading: true,
			};

		case ISSUE_BONUS_SUCCESS:
			return {
				...state,
				issueBonusLoading: false,
				issueBonusSuccess: payload,
				issueBonusError: null,
			};

		case ISSUE_BONUS_FAIL:
			return {
				...state,
				issueBonusError: payload,
				issueBonusLoading: false,
				issueBonusSuccess: false,
			};

		case DEPOSIT_TO_OTHER:
			return {
				...state,
				depositToOtherLoading: true,
			};

		case DEPOSIT_TO_OTHER_SUCCESS:
			return {
				...state,
				depositToOtherLoading: false,
				depositToOtherSuccess: payload,
				depositToOtherError: null,
			};

		case DEPOSIT_TO_OTHER_FAIL:
			return {
				...state,
				depositToOtherError: payload,
				depositToOtherLoading: false,
				depositToOtherSuccess: false,
			};

		case UPDATE_USER_INFO:
			return {
				...state,
				updateUserInfoLoading: true,
			};

		case UPDATE_USER_INFO_SUCCESS:
			return {
				...state,
				updateUserInfoLoading: false,
				updateUserInfoSuccess: payload,
				updateUserInfoError: null,
			};

		case UPDATE_USER_INFO_FAIL:
			return {
				...state,
				updateUserInfoError: payload,
				updateUserInfoLoading: false,
				updateUserInfoSuccess: false,
			};

		case SEND_PASSWORD_RESET:
			return {
				...state,
				sendPasswordResetLoading: true,
			};

		case SEND_PASSWORD_RESET_SUCCESS:
			return {
				...state,
				sendPasswordResetLoading: false,
				sendPasswordResetSuccess: payload,
				sendPasswordResetError: null,
			};

		case SEND_PASSWORD_RESET_FAIL:
			return {
				...state,
				sendPasswordResetError: payload,
				sendPasswordResetLoading: false,
				sendPasswordResetSuccess: false,
			};

		case UPDATE_USER_PASSWORD:
			return {
				...state,
				updateUserPasswordLoading: true,
			};

		case UPDATE_USER_PASSWORD_SUCCESS:
			return {
				...state,
				updateUserPasswordLoading: false,
				updateUserPasswordSuccess: payload,
				updateUserPasswordError: null,
			};

		case UPDATE_USER_PASSWORD_FAIL:
			return {
				...state,
				updateUserPasswordError: payload,
				updateUserPasswordLoading: false,
				updateUserPasswordSuccess: false,
			};

		case CANCEL_USER_BONUS_SUCCESS:
			return {
				...state,
				cancelUserBonusLoading: false,
				cancelUserBonusSuccess: payload,
				cancelUserBonusError: null,
			};

		case CANCEL_USER_BONUS_FAIL:
			return {
				...state,
				cancelUserBonusError: payload,
				cancelUserBonusLoading: false,
				cancelUserBonusSuccess: false,
			};

		case CANCEL_USER_BONUS:
			return {
				...state,
				cancelUserBonusLoading: true,
			};

		case UPDATE_USER_COMMENT_SUCCESS:
			return {
				...state,
				updateUserCommentLoading: false,
				updateUserCommentSuccess: payload,
				updateUserCommentError: null,
			};

		case UPDATE_USER_COMMENT_FAIL:
			return {
				...state,
				updateUserCommentError: payload,
				updateUserCommentLoading: false,
				updateUserCommentSuccess: false,
			};

		case UPDATE_USER_COMMENT:
			return {
				...state,
				updateUserCommentLoading: true,
				updateUserCommentError: false,
				updateUserCommentSuccess: false,
			};

		case DELETE_USER_COMMENT_SUCCESS:
			return {
				...state,
				deleteUserCommentLoading: false,
				deleteUserCommentError: false,
				deleteUserCommentSuccess: true,
			};

		case DELETE_USER_COMMENT_FAIL:
			return {
				...state,
				deleteUserCommentError: payload,
				deleteUserCommentLoading: false,
				deleteUserCommentSuccess: false,
			};

		case DELETE_USER_COMMENT:
			return {
				...state,
				deleteUserCommentError: false,
				deleteUserCommentLoading: true,
				deleteUserCommentSuccess: false,
			};

		case ATTACH_TAG_SUCCESS:
			return {
				...state,
				attachTagLoading: false,
				attachTag: true,
				attachTagError: null,
			};

		case ATTACH_TAG_FAIL:
			return {
				...state,
				attachTagLoading: false,
				attachTag: false,
				attachTagError: payload,
			};

		case ATTACH_TAG:
			return {
				...state,
				attachTagLoading: true,
				attachTag: false,
				attachTagError: null,
			};

		case CREATE_TAG:
			return {
				...state,
				createTagLoading: true,
				createTag: false,
				createTagError: null,
			};

		case CREATE_TAG_SUCCESS:
			return {
				...state,
				createTagLoading: false,
				createTag: payload,
				createTagError: null,
			};

		case CREATE_TAG_FAIL:
			return {
				...state,
				createTagLoading: false,
				createTag: false,
				createTagError: payload,
			};

		case GET_ALL_TAGS_SUCCESS:
			return {
				...state,
				userTagsLoading: false,
				userTags: payload,
				userTagsError: null,
				userTagsById: keyBy(payload?.tags, 'id'),
			};

		case GET_ALL_TAGS_FAIL:
			return {
				...state,
				userTagsLoading: false,
				userTagsError: payload,
			};

		case GET_ALL_TAGS:
			return {
				...state,
				userTagsLoading: true,
				userTagsError: null,
			};

		case REMOVE_TAG_SUCCESS:
			return {
				...state,
				removeUserTag: true,
				removeUserTagLoading: false,
				removeUserTagError: null,
			};

		case REMOVE_TAG_FAIL:
			return {
				...state,
				removeUserTag: false,
				removeUserTagLoading: false,
				removeUserTagError: payload,
			};

		case REMOVE_TAG:
			return {
				...state,
				removeUserTag: false,
				removeUserTagLoading: true,
				removeUserTagError: null,
			};

		case REQUEST_DOCUMENT:
			return {
				...state,
				requestDocumentLoading: true,
				requestDocument: null,
				requestDocumentError: null,
			};

		case REQUEST_DOCUMENT_SUCCESS:
			return {
				...state,
				requestDocumentLoading: false,
				requestDocument: payload,
				requestDocumentError: null,
			};

		case REQUEST_DOCUMENT_FAIL:
			return {
				...state,
				requestDocumentLoading: false,
				requestDocumentError: payload,
				requestDocument: null,
			};

		case VERIFY_DOCUMENT:
			return {
				...state,
				verifyDocumentLoading: true,
				verifyDocument: null,
				verifyDocumentError: null,
			};

		case VERIFY_DOCUMENT_SUCCESS:
			return {
				...state,
				verifyDocumentLoading: false,
				verifyDocument: payload,
				verifyDocumentError: null,
			};

		case VERIFY_DOCUMENT_FAIL:
			return {
				...state,
				verifyDocumentLoading: false,
				verifyDocument: null,
				verifyDocumentError: payload,
			};

		case REJECT_DOCUMENT:
			return {
				...state,
				rejectDocumentLoading: true,
				rejectDocument: null,
				rejectDocumentError: null,
			};

		case REJECT_DOCUMENT_SUCCESS:
			return {
				...state,
				rejectDocumentLoading: false,
				rejectDocument: payload,
				rejectDocumentError: null,
			};

		case REJECT_DOCUMENT_FAIL:
			return {
				...state,
				rejectDocumentLoading: false,
				rejectDocument: null,
				rejectDocumentError: payload,
			};

		case ACTIVATE_KYC:
			return {
				...state,
				activeKycLoading: true,
				activeKyc: null,
				activeKycError: null,
			};

		case ACTIVATE_KYC_SUCCESS:
			return {
				...state,
				activeKycLoading: false,
				activeKyc: payload,
				activeKycError: null,
			};

		case ACTIVATE_KYC_FAIL:
			return {
				...state,
				activeKycLoading: false,
				activeKyc: null,
				activeKycError: payload,
			};

		case INACTIVE_KYC:
			return {
				...state,
				inActiveKycLoading: true,
				inActiveKyc: null,
				inActiveKycError: null,
			};

		case INACTIVE_KYC_SUCCESS:
			return {
				...state,
				inActiveKycLoading: false,
				inActiveKyc: payload,
				inActiveKycError: null,
			};

		case INACTIVE_KYC_FAIL:
			return {
				...state,
				inActiveKycLoading: false,
				inActiveKyc: null,
				inActiveKycError: payload,
			};

		case USER_REFERRALS:
			return {
				...state,
				referralsLoading: true,
			};

		case USER_REFERRALS_SUCCESS:
			return {
				...state,
				referralsLoading: false,
				referrals: payload,
			};

		case USER_REFERRALS_FAIL:
			return {
				...state,
				referralsLoading: false,
				referralsError: payload,
			};
		case DELETE_TAG:
			return {
				...state,
				deleteTagLoading: true,
			};

		case DELETE_TAG_SUCCESS:
			return {
				...state,
				deleteTagLoading: false,
			};

		case DELETE_TAG_FAIL:
			return {
				...state,
				deleteTagLoading: false,
			};
		case UPDATE_TAG:
			return {
				...state,
				updateTagLoading: true,
			};
		case UPDATE_TAG_SUCCESS:
			return {
				...state,
				updateTagLoading: false,
			};
		case UPDATE_TAG_FAIL:
			return {
				...state,
				updateTagLoading: false,
			};
		case VERIFY_USER_KYC:
			return {
				...state,
				verifyUserKycLoading: true,
			};
		case VERIFY_USER_KYC_SUCCESS:
			return {
				...state,
				verifyUserKycLoading: false,
				verifyUserKycSuccess: true,
				verifyUserKycError: null,
			};
		case VERIFY_USER_KYC_FAIL:
			return {
				...state,
				verifyUserKycError: payload,
				verifyUserKycLoading: false,
				verifyUserKycSuccess: false,
			};

		case RESET_USER_PROFILE_UPDATE_LIMIT:
			return {
				...state,
				resetUpdateProfileLimitLoading: true,
			};

		case RESET_USER_PROFILE_UPDATE_LIMIT_SUCCESS:
			return {
				...state,
				resetUpdateProfileLimitLoading: false,
				resetUpdateProfileLimitSuccess: true,
				resetUpdateProfileLimitError: null,
			};

		case RESET_USER_PROFILE_UPDATE_LIMIT_FAIL:
			return {
				...state,
				resetUpdateProfileLimitError: payload,
				resetUpdateProfileLimitLoading: false,
				resetUpdateProfileLimitSuccess: false,
			};

		default:
			return { ...state };
	}
};

export default UserDetails;
