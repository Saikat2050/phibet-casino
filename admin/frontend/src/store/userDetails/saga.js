/* eslint-disable no-param-reassign */
import { put, takeLatest, all, fork, select } from 'redux-saga/effects';

// Redux States
import {
	getUserDetailsSuccess,
	getUserDetailsFail,
	getUserBonusSuccess,
	getUserBonusFail,
	createUserCommentSuccess,
	createUserCommentFail,
	resetUserLimitFail,
	resetUserLimitSuccess,
	updateSAUserStatusFail,
	updateSAUserStatusSuccess,
	markUserAsInternalSuccess,
	markUserAsInternalFail,
	verifyUserEmailSuccess,
	verifyUserEmailFail,
	getDuplicateUsersSuccess,
	getDuplicateUsersFail,
	getAllBonusSuccess,
	getAllBonusFail,
	getUserBonusDetailsSuccess,
	getUserBonusDetailsFail,
	issueBonusSuccess,
	issueBonusFail,
	depositToOtherSuccess,
	depositToOtherFail,
	updateUserInfoSuccess,
	updateUserInfoFail,
	sendPasswordResetSuccess,
	sendPasswordResetFail,
	updateUserPasswordSuccess,
	updateUserPasswordFail,
	cancelUserBonusSuccess,
	cancelUserBonusFail,
	attachTagSuccess,
	attachTagFail,
	getAllTagsSuccess,
	getAllTagsFail,
	removeTagSuccess,
	removeTagFail,
	requestDocumentSuccess,
	requestDocumentFail,
	verifyDocumentSuccess,
	verifyDocumentFail,
	rejectDocumentSuccess,
	rejectDocumentFail,
	createTagSuccess,
	createTagFail,
	activateKycSuccess,
	activateKycFail,
	inActiveKycSuccess,
	inActiveKycFail,
	updateUserCommentSuccess,
	updateUserCommentFail,
	deleteUserCommentSuccess,
	deleteUserCommentFail,
	userReferralsSuccess,
	userReferralsFail,
	getUserDetails as userDetailsStart,
	deleteTagFail,
	deleteTagSuccess,
	getAllTags,
	verifyUserPhoneSuccess,
	verifyUserPhoneFail,
	verifyUserKycSuccess,
	verifyUserKycFail,
	resetUserProfileUpdateLimitSuccess,
	resetUserProfileUpdateLimitFail,
	getUserDetails,
} from './actions';
import {
	ACTIVATE_KYC,
	ATTACH_TAG,
	CANCEL_USER_BONUS,
	CREATE_TAG,
	CREATE_USER_COMMENT,
	DELETE_TAG,
	DELETE_USER_COMMENT,
	DEPOSIT_TO_OTHER,
	DISABLE_USER,
	GET_ALL_BONUS,
	GET_ALL_TAGS,
	GET_BONUS_DETAILS,
	GET_DUPLICATE_USERS,
	GET_USER_BONUS,
	GET_USER_DETAILS,
	INACTIVE_KYC,
	ISSUE_BONUS,
	MARK_USER_AS_INTERNAL,
	REJECT_DOCUMENT,
	REMOVE_TAG,
	REQUEST_DOCUMENT,
	RESET_USER_LIMIT,
	RESET_USER_PROFILE_UPDATE_LIMIT,
	SEND_PASSWORD_RESET,
	UPDATE_SA_USER_STATUS,
	UPDATE_TAG,
	UPDATE_USER_COMMENT,
	UPDATE_USER_INFO,
	UPDATE_USER_PASSWORD,
	USER_REFERRALS,
	VERIFY_DOCUMENT,
	VERIFY_USER_EMAIL,
	VERIFY_USER_KYC,
	VERIFY_USER_PHONE,
} from './actionTypes';
import {
	getAllBonus,
	getAllUserTags,
	getBonusDetail,
	getDuplicateUsers,
	getUserBonuses,
	getUserDetailsCall,
	getUserReferrals,
} from '../../network/getRequests';
import {
	activateKyc,
	addDepositToOtherCall,
	attachUserTags,
	createUserCommentEntry,
	createUserTags,
	disableUserCall,
	inActiveKyc,
	issueBonus,
	rejectDocumentCall,
	removeUserTags,
	requestDocument,
	resetDepositLimitCall,
	resetPasswordEmail,
	resetUserLimitCall,
	updateComment,
	updateSAUserStatusCall,
	updateUserInfoCall,
	updateUserPassword,
	updateUserTags,
	verifyDocument,
	verifyPlayerEmail,
	verifyPlayerPhone,
} from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';
import {
	cancelBonus,
	// cancelDocumentRequest,
	markUserAsInternal,
	resetUserProfileLimitCall,
	verifyPlayerKyc,
} from '../../network/putRequests';
import { formPageTitle } from '../../components/Common/constants';
import { fetchPlayersSuccess } from '../actions';
import { deleteTags, deleteUserComment } from '../../network/deleteRequests';

function* getUserDetailsWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getUserDetailsCall(payload);

		yield put(getUserDetailsSuccess(data?.data));
	} catch (e) {
		yield put(getUserDetailsFail(e.message));
	}
}

function* getUserBonusWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getUserBonuses(payload);

		yield put(getUserBonusSuccess(data?.data?.userBonus));
	} catch (e) {
		yield put(getUserBonusFail(e.message));
	}
}

function* getAllUserTagsWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getAllUserTags(payload);

		yield put(getAllTagsSuccess(data?.data));
	} catch (e) {
		yield put(getAllTagsFail(e.message));
	}
}

function* createUserCommentWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield createUserCommentEntry(payload);

		showToastr({
			message: `Note Added Successfully`,
			type: 'success',
		});

		window.localStorage.removeItem(formPageTitle.notes);
		yield put(createUserCommentSuccess(data?.data?.comment));
	} catch (e) {
		yield put(createUserCommentFail(e.message));
	}
}

function* resetUserLimitWorker(action) {
	try {
		const { userId, value, type, key, reset } = action && action.payload;
		if (type === 'bet') {
			yield resetUserLimitCall({
				userId,
				value,
				key,
				reset,
			});
		} else if (type === 'deposit' || type === 'loss') {
			yield resetDepositLimitCall({
				userId,
				value,
				key,
				reset,
			});
		}
		showToastr({
			message: `Limit ${reset ? 'Reset' : 'Set'} Successfully`,
			type: 'success',
		});
		yield put(resetUserLimitSuccess());
	} catch (e) {
		yield put(resetUserLimitFail(e.message));
	}
}

function* disableUserWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield disableUserCall(payload);
		yield put(resetUserLimitSuccess(data?.data));
		showToastr({
			message: `User ${payload.reset ? 'Enabled' : 'Disabled'} Successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(resetUserLimitFail(e.message));
	}
}

function* updateSAUserStatusWorker(action) {
	try {
		const payload = action && action.payload;
		// eslint-disable-next-line prefer-destructuring
		const pageType = payload.pageType;
		delete payload.pageType;
		const { data } = yield updateSAUserStatusCall(payload);
		yield put(updateSAUserStatusSuccess(data?.data));
		if (action?.callback) {
			action.callback();
		}
		if (pageType === 'PlayerListing') {
			const { players } = yield select((state) => state.Players);
			const newPlayers = players?.users?.map((player) => {
				if (payload?.userIds?.includes(player?.id)) {
					player.isActive = payload.isActive;
				}
				return player;
			});

			yield put(
				fetchPlayersSuccess({
					...players,
					users: newPlayers,
				})
			);
		}
		showToastr({
			message: !payload?.isActive
				? 'Player inactivated successfully'
				: 'Player activated successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(updateSAUserStatusFail(e.message));
	}
}

function* markUserAsInternalWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield markUserAsInternal(payload);
		yield put(markUserAsInternalSuccess(data?.data));

		showToastr({
			message: `User Marked as Internal`,
			type: 'success',
		});
	} catch (e) {
		yield put(markUserAsInternalFail(e.message));
	}
}

function* verifyUserEmailWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield verifyPlayerEmail(payload);
		yield put(verifyUserEmailSuccess(data?.data));

		showToastr({
			message: `User Email Verified Successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(verifyUserEmailFail(e.message));
	}
}

function* verifyUserKycWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield verifyPlayerKyc(payload);
		yield put(verifyUserKycSuccess(data?.data));

		showToastr({
			message: `User KYC Verified Successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(verifyUserKycFail(e.message));
	}
}

function* verifyUserPhoneWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield verifyPlayerPhone(payload);
		yield put(verifyUserPhoneSuccess(data?.data));

		showToastr({
			message: `User Phone Verified Successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(verifyUserPhoneFail(e.message));
	}
}

function* createUserTagsWorker(action) {
	try {
		const payload = action && action.payload;
		yield createUserTags(payload);
		yield put(createTagSuccess(true));
		// const { data } = yield getAllUserTags();
		// yield put(getAllTagsSuccess(data?.data));
		yield put(getAllTags());
		showToastr({
			message: `Segment Created Successfully`,
			type: 'success',
		});
		if (action?.callback) {
			action.callback();
		}
	} catch (e) {
		yield put(createTagFail(e.message));
	}
}

function* attachUserTagsWorker(action) {
	try {
		const payload = action && action.payload;
		yield attachUserTags(payload);
		yield put(attachTagSuccess());

		showToastr({
			message: `Segment Attached Successfully`,
			type: 'success',
		});
		if (action?.callback) {
			action.callback();
		}
	} catch (e) {
		yield put(attachTagFail(e.message));
	}
}

function* removeUserTagsWorker(action) {
	try {
		const payload = action && action.payload;
		yield removeUserTags(payload);
		yield put(removeTagSuccess());

		showToastr({
			message: `Segment Removed Successfully`,
			type: 'success',
		});
		if (action?.callback) {
			action.callback();
		}
	} catch (e) {
		yield put(removeTagFail(e.message));
	}
}

function* getDuplicateUsersWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getDuplicateUsers(payload);
		yield put(getDuplicateUsersSuccess(data?.data));
	} catch (e) {
		yield put(getDuplicateUsersFail(e.message));
	}
}

function* getBonusDetailsWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getBonusDetail(payload);
		yield put(getUserBonusDetailsSuccess(data?.data));
	} catch (e) {
		yield put(getUserBonusDetailsFail(e.message));
	}
}

function* getAllBonusWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getAllBonus(payload);
		yield put(getAllBonusSuccess(data?.data));
	} catch (e) {
		yield put(getAllBonusFail(e.message));
	}
}

function* issueBonusWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield issueBonus(payload);
		yield put(issueBonusSuccess(data?.data?.bonus));
		showToastr({
			message: `Bonus Issued Successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(issueBonusFail(e.message));
	}
}

function* depositToOtherWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield addDepositToOtherCall(payload);
		yield put(depositToOtherSuccess(data?.data?.bonus));
		showToastr({
			message:
				payload.amount > 0
					? `${payload?.purpose || 'Purchase'} Successful`
					: 'Amount Removed from Wallet Successful',
			type: 'success',
		});
		yield put(userDetailsStart({ playerId: payload.userId }));
	} catch (e) {
		yield put(depositToOtherFail(e.message));
	}
}

function* updateUserInfoWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield updateUserInfoCall(payload);
		yield put(updateUserInfoSuccess(data?.data));
		showToastr({
			message: 'User Info Updated Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(updateUserInfoFail(e.message));
	}
}

function* sendPasswordResetWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield resetPasswordEmail(payload);
		yield put(sendPasswordResetSuccess(data?.data));
		showToastr({
			message: 'Reset Link Sent Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(sendPasswordResetFail(e.message));
	}
}

function* updateUserPasswordWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield updateUserPassword(payload);
		yield put(updateUserPasswordSuccess(data?.data));
		showToastr({
			message: 'User Password Updated Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(updateUserPasswordFail(e.message));
	}
}

function* requestDocumentWorker(action) {
	try {
		const payload = action && action.payload;
		yield requestDocument(payload);
		yield put(requestDocumentSuccess(true));
		showToastr({
			message: 'Document Requested Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(requestDocumentFail(e.message));
	}
}

function* verifyDocumentWorker(action) {
	try {
		const payload = action && action.payload;
		yield verifyDocument(payload);
		yield put(verifyDocumentSuccess(true));
		showToastr({
			message: 'Document Verified Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(verifyDocumentFail(e.message));
	}
}

function* rejectDocumentWorker(action) {
	try {
		const payload = action && action.payload;
		yield rejectDocumentCall(payload);
		yield put(rejectDocumentSuccess(true));
		showToastr({
			message: 'Document Rejected!',
			type: 'success',
		});
	} catch (e) {
		yield put(rejectDocumentFail(e.message));
	}
}

function* cancelUserBonusWorker(action) {
	try {
		const payload = action && action.payload;

		yield cancelBonus(payload);
		yield put(cancelUserBonusSuccess(true));
		showToastr({
			message: 'Bonus Cancelled Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(cancelUserBonusFail(e.message));
	}
}

function* updateUserCommentWorker(action) {
	try {
		const payload = action && action.payload;

		yield updateComment(payload);
		yield put(updateUserCommentSuccess(true));
		showToastr({
			message: 'Updated Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(updateUserCommentFail(e.message));
	}
}

function* deleteUserCommentWorker(action) {
	try {
		const payload = action && action.payload;

		yield deleteUserComment(payload);
		yield put(deleteUserCommentSuccess(true));
		showToastr({
			message: 'Deleted Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(deleteUserCommentFail(e.message));
	}
}

function* activateKycWorker(action) {
	try {
		const payload = action && action.payload;

		yield activateKyc(payload);
		yield put(activateKycSuccess(true));
		showToastr({
			message: 'Kyc Approved',
			type: 'success',
		});
	} catch (e) {
		yield put(activateKycFail(e.message));
	}
}

function* inActiveKycWorker(action) {
	try {
		const payload = action && action.payload;

		yield inActiveKyc(payload);
		yield put(inActiveKycSuccess(true));
		showToastr({
			message: 'Kyc Rejected',
			type: 'success',
		});
	} catch (e) {
		yield put(inActiveKycFail(e.message));
	}
}

function* userReferralsWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getUserReferrals(payload);
		yield put(userReferralsSuccess(data?.data));
	} catch (e) {
		yield put(userReferralsFail(e.message));
	}
}
function* deleteTegWorker(action) {
	try {
		const payload = action && action.payload;
		yield deleteTags(payload);
		yield put(deleteTagSuccess());
		// const { data } = yield getAllUserTags();
		// yield put(getAllTagsSuccess(data?.data));
		yield put(getAllTags());
		showToastr({
			message: 'Deleted Successfully',
			type: 'success',
		});
		if (action?.callback) {
			action.callback();
		}
	} catch (e) {
		yield put(deleteTagFail());
	}
}
function* updateTegWorker(action) {
	try {
		const payload = action && action.payload;
		yield updateUserTags(payload);
		yield put(deleteTagSuccess());
		// const { data } = yield getAllUserTags();
		// yield put(getAllTagsSuccess(data?.data));
		yield put(getAllTags());
		showToastr({
			message: 'Update Successfully',
			type: 'success',
		});
		if (action?.callback) {
			action.callback();
		}
	} catch (e) {
		yield put(deleteTagFail());
	}
}

function* resetUpdateProfileLimitWorker(action) {
	try {
		const payload = action && action.payload;
		yield resetUserProfileLimitCall(payload);
		yield put(resetUserProfileUpdateLimitSuccess());
		yield put(getUserDetails({ playerId: payload.userId }))

		showToastr({
			message: 'User Update Profile Limit Updated Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(resetUserProfileUpdateLimitFail());
	}
}

function* userDetailsWatcher() {
	yield takeLatest(GET_USER_DETAILS, getUserDetailsWorker);
	yield takeLatest(GET_USER_BONUS, getUserBonusWorker);
	yield takeLatest(CREATE_USER_COMMENT, createUserCommentWorker);
	yield takeLatest(RESET_USER_LIMIT, resetUserLimitWorker);
	yield takeLatest(DISABLE_USER, disableUserWorker);
	yield takeLatest(UPDATE_SA_USER_STATUS, updateSAUserStatusWorker);
	yield takeLatest(MARK_USER_AS_INTERNAL, markUserAsInternalWorker);
	yield takeLatest(VERIFY_USER_EMAIL, verifyUserEmailWorker);
	yield takeLatest(VERIFY_USER_PHONE, verifyUserPhoneWorker);
	yield takeLatest(ATTACH_TAG, attachUserTagsWorker);
	yield takeLatest(GET_DUPLICATE_USERS, getDuplicateUsersWorker);
	yield takeLatest(GET_BONUS_DETAILS, getBonusDetailsWorker);
	yield takeLatest(GET_ALL_BONUS, getAllBonusWorker);
	yield takeLatest(ISSUE_BONUS, issueBonusWorker);
	yield takeLatest(DEPOSIT_TO_OTHER, depositToOtherWorker);
	yield takeLatest(UPDATE_USER_INFO, updateUserInfoWorker);
	yield takeLatest(UPDATE_USER_PASSWORD, updateUserPasswordWorker);
	yield takeLatest(SEND_PASSWORD_RESET, sendPasswordResetWorker);
	yield takeLatest(CANCEL_USER_BONUS, cancelUserBonusWorker);
	yield takeLatest(UPDATE_USER_COMMENT, updateUserCommentWorker);
	yield takeLatest(GET_ALL_TAGS, getAllUserTagsWorker);
	yield takeLatest(REMOVE_TAG, removeUserTagsWorker);
	yield takeLatest(REQUEST_DOCUMENT, requestDocumentWorker);
	yield takeLatest(VERIFY_DOCUMENT, verifyDocumentWorker);
	yield takeLatest(REJECT_DOCUMENT, rejectDocumentWorker);
	yield takeLatest(CREATE_TAG, createUserTagsWorker);
	yield takeLatest(ACTIVATE_KYC, activateKycWorker);
	yield takeLatest(INACTIVE_KYC, inActiveKycWorker);
	yield takeLatest(DELETE_USER_COMMENT, deleteUserCommentWorker);
	yield takeLatest(USER_REFERRALS, userReferralsWorker);
	yield takeLatest(DELETE_TAG, deleteTegWorker);
	yield takeLatest(UPDATE_TAG, updateTegWorker);
	yield takeLatest(VERIFY_USER_KYC, verifyUserKycWorker);
	yield takeLatest(RESET_USER_PROFILE_UPDATE_LIMIT, resetUpdateProfileLimitWorker);
}

function* UserDetailsSaga() {
	yield all([fork(userDetailsWatcher)]);
}

export default UserDetailsSaga;
