import { put, takeLatest, fork, all } from 'redux-saga/effects';

// Redux States
import {
	GET_SA_BANNERS,
	GET_DOCUMENT_LABEL,
	CREATE_KYC_LABELS_START,
	EDIT_KYC_LABELS_START,
	EDIT_SA_BANNERS_START,
	GET_LOYALTY_LEVEL,
	UPDATE_LOYALTY_LEVEL,
	DELETE_SA_BANNERS_START,
} from './actionTypes';

import {
	getSABannersSuccess,
	getSABannersFail,
	getDocumentLabelSuccess,
	getDocumentLabelFail,
	createKYCLabelsSuccess,
	createKYCLabelsFail,
	editKYCLabelsSuccess,
	editKYCLabelsFail,
	editSABannersSuccess,
	editSABannersFail,
	getLoyaltyLevelSuccess,
	getLoyaltyLevelFail,
	updateLoyaltyLevelSuccess,
	updateLoyaltyLevelFail,
	getLoyaltyLevel,
	deleteSABannersSuccess,
	deleteSABannersFail,
} from './actions';

import {
	getAllSABanners,
	getDocumentLabelCall,
	getloyaltyLevel,
} from '../../network/getRequests';

import { objectToFormData } from '../../utils/objectToFormdata';
import { showToastr } from '../../utils/helpers';
import {
	createKYCLabels,
	editBanner,
	updateKYCLabels,
} from '../../network/postRequests';

import { updateloyaltyLevel } from '../../network/putRequests';

import { formPageTitle } from '../../components/Common/constants';
import { deleteBanner } from '../../network/deleteRequests';

const BANNER_EXCLUDES = ['sportsbook', 'loyality'];

function* getAllSABannersWorker(action) {
	try {
		const { adminId, tenantId, limit, pageNo } = action && action.payload;

		const { data } = yield getAllSABanners({
			adminId,
			tenantId,
			limit,
			pageNo,
		});

		yield put(
			getSABannersSuccess(
				data?.data?.banners?.filter(
					({ type }) => !BANNER_EXCLUDES?.includes(type)
				) || []
			)
		);
	} catch (e) {
		yield put(getSABannersFail(e?.response?.data?.errors[0]?.description));
	}
}

function* getDocumentLabelWorker(action) {
	try {
		const { userId } = action && action.payload;
		const { data } = yield getDocumentLabelCall({ userId });
		yield put(getDocumentLabelSuccess(data?.data));
	} catch (e) {
		yield put(getDocumentLabelFail(e?.response?.data?.errors[0]?.description));
	}
}

function* createKYCLabelsWorker(action) {
	try {
		const { data } = action && action.payload;
		yield createKYCLabels(data);

		showToastr({
			message: `Label Created Successfully`,
			type: 'success',
		});

		window.localStorage.removeItem(formPageTitle.kyc);
		yield put(createKYCLabelsSuccess());
	} catch (e) {
		yield put(createKYCLabelsFail());
	}
}

function* editKYCLabelsWorker(action) {
	try {
		const { data } = action && action.payload;
		yield updateKYCLabels(data);

		showToastr({
			message: `Label Updated Successfully`,
			type: 'success',
		});

		yield put(editKYCLabelsSuccess());
	} catch (e) {
		yield put(editKYCLabelsFail());
	}
}

function* deleteSABannersWorker(action) {
	try {
		const { data } = action && action.payload;
		yield deleteBanner(data);
		showToastr({
			message: `Banner Deleted Successfully`,
			type: 'success',
		});

		yield put(deleteSABannersSuccess());
	} catch (e) {
		yield put(deleteSABannersFail());
	}
}

function* editSABannersWorker(action) {
	try {
		const { data } = action && action.payload;
		yield editBanner(objectToFormData(data));

		showToastr({
			message: `Banner Uploaded Successfully`,
			type: 'success',
		});

		yield put(editSABannersSuccess());
	} catch (e) {
		yield put(editSABannersFail());
	}
}

function* getloyaltyLevelWorker() {
	try {
		const { data } = yield getloyaltyLevel();

		yield put(getLoyaltyLevelSuccess(data?.data?.loyaltyLevel));
	} catch (e) {
		yield put(getLoyaltyLevelFail(e?.response?.data?.errors[0]?.description));
	}
}

function* updateloyaltyLevelWorker(action) {
	try {
		const { loyaltyLevel, isTenant, tenantId = '' } = action && action.payload;

		yield updateloyaltyLevel({
			isTenant,
			data: { loyaltyLevel: loyaltyLevel?.loyaltyLevel, tenantId },
		});

		yield put(updateLoyaltyLevelSuccess());

		showToastr({
			message: `Data Updated Successfully`,
			type: 'success',
		});
		yield put(getLoyaltyLevel({ isTenant }));
	} catch (e) {
		yield put(updateLoyaltyLevelFail());
	}
}

export function* getAllSABannersWatcher() {
	yield takeLatest(GET_SA_BANNERS, getAllSABannersWorker);
}

export function* getDocumentLabelWatcher() {
	yield takeLatest(GET_DOCUMENT_LABEL, getDocumentLabelWorker);
}

export function* createKYCLabelsWatcher() {
	yield takeLatest(CREATE_KYC_LABELS_START, createKYCLabelsWorker);
}

export function* editKYCLabelsWatcher() {
	yield takeLatest(EDIT_KYC_LABELS_START, editKYCLabelsWorker);
}

export function* editSABannersWatcher() {
	yield takeLatest(EDIT_SA_BANNERS_START, editSABannersWorker);
}

export function* deleteSABannersWatcher() {
	yield takeLatest(DELETE_SA_BANNERS_START, deleteSABannersWorker);
}

export function* getLoyaltyLevelWatcher() {
	yield takeLatest(GET_LOYALTY_LEVEL, getloyaltyLevelWorker);
}

export function* updateLoyaltyLevelWatcher() {
	yield takeLatest(UPDATE_LOYALTY_LEVEL, updateloyaltyLevelWorker);
}

function* SASettingsSaga() {
	yield all([fork(getAllSABannersWatcher)]);
	yield all([fork(getDocumentLabelWatcher)]);
	yield all([fork(createKYCLabelsWatcher)]);
	yield all([fork(editKYCLabelsWatcher)]);
	yield all([fork(editSABannersWatcher)]);
	yield all([fork(getLoyaltyLevelWatcher)]);
	yield all([fork(updateLoyaltyLevelWatcher)]);
	yield all([fork(deleteSABannersWatcher)]);
}

export default SASettingsSaga;
