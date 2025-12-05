/* eslint-disable no-param-reassign */
import { takeLatest, put, select } from 'redux-saga/effects';
import { getAllGroups } from '../../network/getRequests';

import { showToastr } from '../../utils/helpers';

import {
	updateSuperAdminStatusSuccess,
	updateSuperAdminStatusFailure,
	getAllGroupsSuccess,
	getAllGroupsFailure,
} from './actions';

import { getAllAdminsSuccess } from '../actions';

import {
	GET_ALL_GROUP_START,
	UPDATE_SUPER_ADMIN_STATUS_START,
} from './actionTypes';
import { superAdminViewToggleStatus } from '../../network/postRequests';

function* updateSuperAdminStatusWorker(action) {
	try {
		const { payload } = action;

		yield superAdminViewToggleStatus(payload);

		yield put(updateSuperAdminStatusSuccess());

		const { adminDetails } = yield select((state) => state.AllAdmins);

		const newAdminRow = adminDetails?.staff?.map((admin) => {
			if (parseInt(admin?.id, 10) === payload.childAdminId) {
				admin.isActive = !admin.isActive;
			}
			return admin;
		});

		yield put(
			getAllAdminsSuccess({
				...adminDetails,
				staff: newAdminRow,
			})
		);

		showToastr({
			message: 'Status updated Successfully',
			type: 'success',
		});
	} catch (e) {
		yield put(updateSuperAdminStatusFailure());
	}
}

function* getAllGroupsWorker() {
	try {
		const { data } = yield getAllGroups();
		yield put(getAllGroupsSuccess(data?.data?.groupNames));
	} catch (e) {
		yield put(getAllGroupsFailure());
	}
}

export default function* adminUserWatcher() {
	yield takeLatest(GET_ALL_GROUP_START, getAllGroupsWorker);
	yield takeLatest(
		UPDATE_SUPER_ADMIN_STATUS_START,
		updateSuperAdminStatusWorker
	);
}
