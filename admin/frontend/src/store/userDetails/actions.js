import {
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
	ISSUE_BONUS,
	ISSUE_BONUS_FAIL,
	ISSUE_BONUS_SUCCESS,
	MARK_USER_AS_INTERNAL,
	MARK_USER_AS_INTERNAL_FAIL,
	MARK_USER_AS_INTERNAL_SUCCESS,
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
	ATTACH_TAG,
	ATTACH_TAG_SUCCESS,
	ATTACH_TAG_FAIL,
	GET_ALL_TAGS_FAIL,
	GET_ALL_TAGS,
	GET_ALL_TAGS_SUCCESS,
	REMOVE_TAG_SUCCESS,
	REMOVE_TAG_FAIL,
	REMOVE_TAG,
	REQUEST_DOCUMENT_SUCCESS,
	REQUEST_DOCUMENT_FAIL,
	REQUEST_DOCUMENT,
	VERIFY_DOCUMENT_SUCCESS,
	VERIFY_DOCUMENT_FAIL,
	VERIFY_DOCUMENT,
	REJECT_DOCUMENT_SUCCESS,
	REJECT_DOCUMENT_FAIL,
	REJECT_DOCUMENT,
	CREATE_TAG_SUCCESS,
	CREATE_TAG_FAIL,
	CREATE_TAG,
	ACTIVATE_KYC_SUCCESS,
	ACTIVATE_KYC_FAIL,
	ACTIVATE_KYC,
	INACTIVE_KYC,
	INACTIVE_KYC_FAIL,
	INACTIVE_KYC_SUCCESS,
	DELETE_USER_COMMENT_FAIL,
	DELETE_USER_COMMENT,
	DELETE_USER_COMMENT_SUCCESS,
	USER_REFERRALS,
	USER_REFERRALS_FAIL,
	USER_REFERRALS_SUCCESS,
	DELETE_TAG_SUCCESS,
	DELETE_TAG_FAIL,
	DELETE_TAG,
	UPDATE_TAG,
	UPDATE_TAG_SUCCESS,
	UPDATE_TAG_FAIL,
	VERIFY_USER_PHONE,
	VERIFY_USER_PHONE_FAIL,
	VERIFY_USER_KYC_SUCCESS,
	VERIFY_USER_KYC_FAIL,
	VERIFY_USER_KYC,
	RESET_USER_PROFILE_UPDATE_LIMIT,
	RESET_USER_PROFILE_UPDATE_LIMIT_SUCCESS,
	RESET_USER_PROFILE_UPDATE_LIMIT_FAIL,
} from './actionTypes';

export const getUserDetailsSuccess = (payload) => ({
	type: GET_USER_DETAILS_SUCCESS,
	payload,
});

export const getUserDetailsFail = (payload) => ({
	type: GET_USER_DETAILS_FAIL,
	payload,
});

export const getUserDetails = (payload) => ({
	type: GET_USER_DETAILS,
	payload,
});

export const resetUserDetails = (payload) => ({
	type: RESET_USER_DETAILS,
	payload,
});

export const getUserBonusSuccess = (payload) => ({
	type: GET_USER_BONUS_SUCCESS,
	payload,
});

export const getUserBonusFail = (payload) => ({
	type: GET_USER_BONUS_FAIL,
	payload,
});

export const getUserBonus = (payload) => ({
	type: GET_USER_BONUS,
	payload,
});

export const getUserCommentsSuccess = (payload) => ({
	type: GET_USER_COMMENTS_SUCCESS,
	payload,
});

export const getUserCommentsFail = (payload) => ({
	type: GET_USER_COMMENTS_FAIL,
	payload,
});

export const getUserComments = (payload) => ({
	type: GET_USER_COMMENTS,
	payload,
});

export const createUserCommentSuccess = (payload) => ({
	type: CREATE_USER_COMMENT_SUCCESS,
	payload,
});

export const createUserCommentFail = (payload) => ({
	type: CREATE_USER_COMMENT_FAIL,
	payload,
});

export const createUserComment = (payload) => ({
	type: CREATE_USER_COMMENT,
	payload,
});

export const resetUserLimitSuccess = (payload) => ({
	type: RESET_USER_LIMIT_SUCCESS,
	payload,
});

export const resetUserLimitFail = (payload) => ({
	type: RESET_USER_LIMIT_FAIL,
	payload,
});

export const resetUserLimit = (payload) => ({
	type: RESET_USER_LIMIT,
	payload,
});

export const resetUserLimitData = (payload) => ({
	type: RESET_USER_LIMIT_DATA,
	payload,
});

export const disabledUserSuccess = (payload) => ({
	type: DISABLE_USER_SUCCESS,
	payload,
});

export const disableUserFail = (payload) => ({
	type: DISABLE_USER_FAIL,
	payload,
});

export const disableUser = (payload) => ({
	type: DISABLE_USER,
	payload,
});

export const updateSAUserStatusSuccess = (payload) => ({
	type: UPDATE_SA_USER_STATUS_SUCCESS,
	payload,
});

export const updateSAUserStatusFail = (payload) => ({
	type: UPDATE_SA_USER_STATUS_FAIL,
	payload,
});

export const updateSAUserStatus = (payload, callback) => ({
	type: UPDATE_SA_USER_STATUS,
	payload,
	callback,
});

export const markUserAsInternalSuccess = (payload) => ({
	type: MARK_USER_AS_INTERNAL_SUCCESS,
	payload,
});

export const markUserAsInternalFail = (payload) => ({
	type: MARK_USER_AS_INTERNAL_FAIL,
	payload,
});

export const markUserAsInternal = (payload) => ({
	type: MARK_USER_AS_INTERNAL,
	payload,
});

export const verifyUserEmailSuccess = (payload) => ({
	type: VERIFY_USER_EMAIL_SUCCESS,
	payload,
});

export const verifyUserEmailFail = (payload) => ({
	type: VERIFY_USER_EMAIL_FAIL,
	payload,
});

export const verifyUserEmail = (payload) => ({
	type: VERIFY_USER_EMAIL,
	payload,
});

export const verifyUserPhone = (payload) => ({
	type: VERIFY_USER_PHONE,
	payload,
});

export const verifyUserPhoneFail = (payload) => ({
	type: VERIFY_USER_PHONE_FAIL,
	payload,
});

export const verifyUserPhoneSuccess = (payload) => ({
	type: VERIFY_USER_EMAIL_SUCCESS,
	payload,
});

export const getDuplicateUsersSuccess = (payload) => ({
	type: GET_DUPLICATE_USERS_SUCCESS,
	payload,
});

export const getDuplicateUsersFail = (payload) => ({
	type: GET_DUPLICATE_USERS_FAIL,
	payload,
});

export const getDuplicateUsers = (payload) => ({
	type: GET_DUPLICATE_USERS,
	payload,
});

export const getAllBonusSuccess = (payload) => ({
	type: GET_ALL_BONUS_SUCCESS,
	payload,
});

export const getAllBonusFail = (payload) => ({
	type: GET_ALL_BONUS_FAIL,
	payload,
});

export const getAllBonus = (payload) => ({
	type: GET_ALL_BONUS,
	payload,
});

export const getUserBonusDetailsSuccess = (payload) => ({
	type: GET_BONUS_DETAILS_SUCCESS,
	payload,
});

export const getUserBonusDetailsFail = (payload) => ({
	type: GET_BONUS_DETAILS_FAIL,
	payload,
});

export const getUserBonusDetailsReset = (payload) => ({
	type: GET_BONUS_DETAILS_RESET,
	payload,
});

export const getUserBonusDetails = (payload) => ({
	type: GET_BONUS_DETAILS,
	payload,
});

export const issueBonusSuccess = (payload) => ({
	type: ISSUE_BONUS_SUCCESS,
	payload,
});

export const issueBonusFail = (payload) => ({
	type: ISSUE_BONUS_FAIL,
	payload,
});

export const issueBonus = (payload) => ({
	type: ISSUE_BONUS,
	payload,
});

export const depositToOtherSuccess = (payload) => ({
	type: DEPOSIT_TO_OTHER_SUCCESS,
	payload,
});

export const depositToOtherFail = (payload) => ({
	type: DEPOSIT_TO_OTHER_FAIL,
	payload,
});

export const depositToOther = (payload) => ({
	type: DEPOSIT_TO_OTHER,
	payload,
});

export const updateUserInfoSuccess = (payload) => ({
	type: UPDATE_USER_INFO_SUCCESS,
	payload,
});

export const updateUserInfoFail = (payload) => ({
	type: UPDATE_USER_INFO_FAIL,
	payload,
});

export const updateUserInfo = (payload) => ({
	type: UPDATE_USER_INFO,
	payload,
});

export const updateUserPasswordSuccess = (payload) => ({
	type: UPDATE_USER_PASSWORD_SUCCESS,
	payload,
});

export const updateUserPasswordFail = (payload) => ({
	type: UPDATE_USER_PASSWORD_FAIL,
	payload,
});

export const updateUserPassword = (payload) => ({
	type: UPDATE_USER_PASSWORD,
	payload,
});

export const sendPasswordResetSuccess = (payload) => ({
	type: SEND_PASSWORD_RESET_SUCCESS,
	payload,
});

export const sendPasswordResetFail = (payload) => ({
	type: SEND_PASSWORD_RESET_FAIL,
	payload,
});

export const sendPasswordReset = (payload) => ({
	type: SEND_PASSWORD_RESET,
	payload,
});

export const cancelUserBonusFail = (payload) => ({
	type: CANCEL_USER_BONUS_FAIL,
	payload,
});

export const cancelUserBonus = (payload) => ({
	type: CANCEL_USER_BONUS,
	payload,
});

export const cancelUserBonusSuccess = (payload) => ({
	type: CANCEL_USER_BONUS_SUCCESS,
	payload,
});

export const updateUserCommentFail = (payload) => ({
	type: UPDATE_USER_COMMENT_FAIL,
	payload,
});

export const updateUserComment = (payload) => ({
	type: UPDATE_USER_COMMENT,
	payload,
});

export const updateUserCommentSuccess = (payload) => ({
	type: UPDATE_USER_COMMENT_SUCCESS,
	payload,
});

export const deleteUserCommentFail = (payload) => ({
	type: DELETE_USER_COMMENT_FAIL,
	payload,
});

export const deleteUserComment = (payload) => ({
	type: DELETE_USER_COMMENT,
	payload,
});

export const deleteUserCommentSuccess = (payload) => ({
	type: DELETE_USER_COMMENT_SUCCESS,
	payload,
});

export const attachTagSuccess = (payload) => ({
	type: ATTACH_TAG_SUCCESS,
	payload,
});

export const attachTagFail = (payload) => ({
	type: ATTACH_TAG_FAIL,
	payload,
});

export const attachTag = (payload, callback) => ({
	type: ATTACH_TAG,
	payload,
	callback,
});

export const createTagSuccess = (payload) => ({
	type: CREATE_TAG_SUCCESS,
	payload,
});

export const createTagFail = (payload) => ({
	type: CREATE_TAG_FAIL,
	payload,
});

export const createTag = (payload, callback) => ({
	type: CREATE_TAG,
	payload,
	callback,
});

export const getAllTagsSuccess = (payload) => ({
	type: GET_ALL_TAGS_SUCCESS,
	payload,
});

export const getAllTagsFail = (payload) => ({
	type: GET_ALL_TAGS_FAIL,
	payload,
});

export const getAllTags = (payload) => ({
	type: GET_ALL_TAGS,
	payload,
});

export const removeTagSuccess = (payload) => ({
	type: REMOVE_TAG_SUCCESS,
	payload,
});

export const removeTagFail = (payload) => ({
	type: REMOVE_TAG_FAIL,
	payload,
});

export const removeTag = (payload, callback) => ({
	type: REMOVE_TAG,
	payload,
	callback,
});

export const requestDocumentSuccess = (payload) => ({
	type: REQUEST_DOCUMENT_SUCCESS,
	payload,
});

export const requestDocumentFail = (payload) => ({
	type: REQUEST_DOCUMENT_FAIL,
	payload,
});

export const requestDocument = (payload) => ({
	type: REQUEST_DOCUMENT,
	payload,
});

export const verifyDocumentSuccess = (payload) => ({
	type: VERIFY_DOCUMENT_SUCCESS,
	payload,
});

export const verifyDocumentFail = (payload) => ({
	type: VERIFY_DOCUMENT_FAIL,
	payload,
});

export const verifyDocument = (payload) => ({
	type: VERIFY_DOCUMENT,
	payload,
});

export const rejectDocumentSuccess = (payload) => ({
	type: REJECT_DOCUMENT_SUCCESS,
	payload,
});

export const rejectDocumentFail = (payload) => ({
	type: REJECT_DOCUMENT_FAIL,
	payload,
});

export const rejectDocument = (payload) => ({
	type: REJECT_DOCUMENT,
	payload,
});

export const activateKycSuccess = (payload) => ({
	type: ACTIVATE_KYC_SUCCESS,
	payload,
});

export const activateKycFail = (payload) => ({
	type: ACTIVATE_KYC_FAIL,
	payload,
});

export const activateKyc = (payload) => ({
	type: ACTIVATE_KYC,
	payload,
});

export const inActiveKycSuccess = (payload) => ({
	type: INACTIVE_KYC_SUCCESS,
	payload,
});

export const inActiveKycFail = (payload) => ({
	type: INACTIVE_KYC_FAIL,
	payload,
});

export const inActiveKyc = (payload) => ({
	type: INACTIVE_KYC,
	payload,
});

export const userReferrals = (payload) => ({
	type: USER_REFERRALS,
	payload,
});

export const userReferralsSuccess = (payload) => ({
	type: USER_REFERRALS_SUCCESS,
	payload,
});

export const userReferralsFail = (payload) => ({
	type: USER_REFERRALS_FAIL,
	payload,
});

export const deleteTagSuccess = (payload) => ({
	type: DELETE_TAG_SUCCESS,
	payload,
});

export const deleteTagFail = (payload) => ({
	type: DELETE_TAG_FAIL,
	payload,
});

export const deleteTag = (payload, callback) => ({
	type: DELETE_TAG,
	payload,
	callback,
});

export const updateTag = (payload, callback) => ({
	type: UPDATE_TAG,
	payload,
	callback,
});

export const updateTagSuccess = (tag) => ({
	type: UPDATE_TAG_SUCCESS,
	payload: tag,
});

export const updateTagFail = (error) => ({
	type: UPDATE_TAG_FAIL,
	payload: error,
});

export const verifyUserKycSuccess = (payload) => ({
	type: VERIFY_USER_KYC_SUCCESS,
	payload,
});

export const verifyUserKycFail = (payload) => ({
	type: VERIFY_USER_KYC_FAIL,
	payload,
});

export const verifyUserKyc = (payload) => ({
	type: VERIFY_USER_KYC,
	payload,
});

export const resetUserProfileUpdateLimit = (payload) => ({
	type: RESET_USER_PROFILE_UPDATE_LIMIT,
	payload,
});

export const resetUserProfileUpdateLimitSuccess = (payload) => ({
	type: RESET_USER_PROFILE_UPDATE_LIMIT_SUCCESS,
	payload,
});

export const resetUserProfileUpdateLimitFail = (payload) => ({
	type: RESET_USER_PROFILE_UPDATE_LIMIT_FAIL,
	payload,
});
