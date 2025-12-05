import { put, takeLatest, fork, all } from 'redux-saga/effects';

import {
	CREATE_VIP_TIER_START,
	EDIT_VIP_TIER_START,
	GET_VIP_TIER_START,
	GET_VIP_TIER_BY_ID_START,
} from './actionTypes';
import {
	createVipTierFail,
	createVipTierSuccess,
	editVIPTierFail,
	editVIPTierSuccess,
	getVIPTierFail,
	getVIPTierSuccess,
	getVIPTierByIdSuccess,
	getVIPTierByIdFail,
} from './actions';
import { showToastr } from '../../utils/helpers';
import { getVIPTiers, getVIPTierById } from '../../network/getRequests';
import { createVIPTier } from '../../network/postRequests';
import { editVIPTier } from '../../network/putRequests';

function* getVIPTiersWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getVIPTiers(payload);
		yield put(getVIPTierSuccess(data?.data));
	} catch (e) {
		yield put(getVIPTierFail(e?.response?.data?.errors[0]?.description));
	}
}

function* getVIPTierByIdWorker(action) {
	try {
		const { id } = action.payload;
		const { data } = yield getVIPTierById({ id });
		yield put(getVIPTierByIdSuccess(data?.data));
	} catch (e) {
		yield put(getVIPTierByIdFail(e?.response?.data?.errors[0]?.description));
	}
}

function* editVIPTierWorker(action) {
	const { values, navigate } = action && action.payload;
	try {
		const { data } = yield editVIPTier(values);
		yield put(editVIPTierSuccess(data));
		if (navigate) navigate('/vip');
		showToastr({
			message: `VIP tier edited successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(editVIPTierFail(e?.response?.data?.errors[0]?.description));
		// showToastr({
		// 	message: `Something went wrong`,
		// 	type: 'error',
		// });
	}
}

function* createVIPTierWorker(action) {
	const { values, navigate } = action && action.payload;
	try {
		const { data } = yield createVIPTier(values);
		yield put(createVipTierSuccess(data));
		if (navigate) navigate('/vip');
		showToastr({
			message: `VIP Level Created`,
			type: 'success',
		});
	} catch (e) {
		yield put(createVipTierFail(e?.response?.data?.errors[0]?.description));
		// if (navigate) navigate('/vip');
	}
}

export function* VIPTiersWatcher() {
	yield takeLatest(EDIT_VIP_TIER_START, editVIPTierWorker);
	yield takeLatest(CREATE_VIP_TIER_START, createVIPTierWorker);
	yield takeLatest(GET_VIP_TIER_START, getVIPTiersWorker);
	yield takeLatest(GET_VIP_TIER_BY_ID_START, getVIPTierByIdWorker);
}

function* VIPTiersSaga() {
	yield all([fork(VIPTiersWatcher)]);
}

export default VIPTiersSaga;
