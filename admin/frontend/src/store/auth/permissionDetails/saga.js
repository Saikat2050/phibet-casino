import { call, put, takeLatest } from 'redux-saga/effects';
import { SUPER_ADMIN_START } from './actionTypes';
import { getPermissionDetails } from '../../../network/getRequests';
import { getSuperAdminFail, getSuperAdminSuccess } from './actions';
import { saveSiteDetails } from '../../layout/actions';

export function* getSuperAdminPermissions() {
	try {
		let details = yield call(getPermissionDetails);
		details = details.data.data.user;
		yield put(getSuperAdminSuccess(details));
		yield put(saveSiteDetails(details.siteLayout));
	} catch (er) {
		yield put(getSuperAdminFail(`Unable to get roles ${er?.message || ''}`));
	}
}

export default function* PermissionDetails() {
	yield takeLatest(SUPER_ADMIN_START, getSuperAdminPermissions);
}
