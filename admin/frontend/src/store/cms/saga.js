/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-param-reassign */
import { put, takeLatest, all, fork, select } from 'redux-saga/effects';

// Crypto Redux States
import {
	getAllCmsDetailsSuccess,
	getAllCmsDetailsFail,
	updateSaCmsStatusSuccess,
	updateSaCmsStatusFail,
	getCmsDynamicKeysSuccess,
	getCmsDynamicKeysFail,
	createSaCmsSuccess,
	createSaCmsFail,
	getCmsByPageIdSuccess,
	getCmsByPageIdFail,
	updateSaCmsSuccess,
	updateSaCmsFail,
	deleteCmsSuccess,
	deleteCmsFail,
} from './actions';

import {
	GET_ALL_CMS_DATA,
	UPDATE_SA_CMS_STATUS,
	GET_CMS_DYNAMIC_KEYS,
	CREATE_SA_CMS,
	GET_CMS_BY_PAGE_ID,
	UPDATE_SA_CMS,
	DELETE_CMS,
} from './actionTypes';

import {
	getAllCms,
	getCMSDynamicKeys,
	getCmsByPageId,
} from '../../network/getRequests';

import {
	createSuperAdminCMS,
	updatePageStatus,
	updateSuperAdminCMS,
} from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';
import { formPageTitle } from '../../components/Common/constants';
import { deleteCmsRequest } from '../../network/deleteRequests';

function* getCmsDetails(action) {
	const payload = action && action.payload;

	try {
		const { data } = yield getAllCms(payload);
		yield put(getAllCmsDetailsSuccess(data?.data));
	} catch (error) {
		yield put(
			getAllCmsDetailsFail(error?.response?.data?.errors[0]?.description)
		);
	}
}

function* getCmsByPageIdWorker(action) {
	try {
		const { cmsPageId } = action && action.payload;

		const { data } = yield getCmsByPageId({
			cmsPageId,
		});

		yield put(getCmsByPageIdSuccess(data?.data?.page));
	} catch (e) {
		yield put(getCmsByPageIdFail(e?.response?.data?.errors[0].description));
	}
}

function* getCMSDynamicKeysWorker() {
	try {
		const { data } = yield getCMSDynamicKeys();

		yield put(getCmsDynamicKeysSuccess(data?.data));
	} catch (e) {
		yield put(getCmsDynamicKeysFail());
	}
}

function* createSuperAdminCMSWorker(action) {
	try {
		const { cmsData, navigate } = action && action.payload;

		yield createSuperAdminCMS(cmsData);

		showToastr({
			message: 'CMS Created successfully',
			type: 'success',
		});

		window.localStorage.removeItem(formPageTitle.cms);

		yield put(createSaCmsSuccess());
		if (navigate) {
			navigate('/cms');
		}
	} catch (e) {
		yield put(createSaCmsFail(e?.response?.data?.errors[0].description));
	}
}

function* updateSACMSStatusWorker(action) {
	try {
		const payload = action && action.payload;

		yield updatePageStatus(payload);

		showToastr({
			message: 'CMS Status Updated Successfully',
			type: 'success',
		});

		const { cmsDetails } = yield select((state) => state.AllCms);

		const updatedCmsDetails = cmsDetails?.pages?.map((cms) => {
			if (cms?.id === payload.pageId) {
				cms.isActive = !cms.isActive;
			}
			return cms;
		});

		yield put(
			getAllCmsDetailsSuccess({
				...cmsDetails,
				pages: updatedCmsDetails,
			})
		);

		yield put(updateSaCmsStatusSuccess());
	} catch (e) {
		yield put(updateSaCmsStatusFail());
	}
}

function* updateSuperAdminCMSWorker(action) {
	try {
		const { cmsData, navigate } = action && action.payload;

		yield updateSuperAdminCMS(cmsData);

		showToastr({
			message: 'CMS Updated Successfully',
			type: 'success',
		});

		yield put(updateSaCmsSuccess());
		if (navigate) {
			navigate('/cms');
		}
	} catch (e) {
		yield put(updateSaCmsFail());
	}
}

function* deleteCmsWorker(action) {
	try {
		const { data, handleClose } = action && action.payload;
		const resData = yield deleteCmsRequest(data);
		yield put(deleteCmsSuccess());
		showToastr({
			message: resData?.data?.data?.message,
			type: 'success',
		});
		if (handleClose) {
			handleClose();
		}
	} catch (error) {
		yield put(deleteCmsFail(error?.response?.data?.errors[0]?.description));
	}
}

export function* watchGetAllCmsData() {
	yield takeLatest(GET_ALL_CMS_DATA, getCmsDetails);
	yield takeLatest(UPDATE_SA_CMS_STATUS, updateSACMSStatusWorker);
	yield takeLatest(GET_CMS_DYNAMIC_KEYS, getCMSDynamicKeysWorker);
	yield takeLatest(CREATE_SA_CMS, createSuperAdminCMSWorker);
	yield takeLatest(GET_CMS_BY_PAGE_ID, getCmsByPageIdWorker);
	yield takeLatest(UPDATE_SA_CMS, updateSuperAdminCMSWorker);
	yield takeLatest(DELETE_CMS, deleteCmsWorker);
}

function* CmsDetailsSaga() {
	yield all([fork(watchGetAllCmsData)]);
}

export default CmsDetailsSaga;
