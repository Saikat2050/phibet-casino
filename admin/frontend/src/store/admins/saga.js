import { put, takeLatest, all, fork, takeEvery } from 'redux-saga/effects';

// Crypto Redux States
import { isEmpty } from 'lodash';
import {
	getAllAdminsSuccess,
	getAllAdminsFail,
	addSuperAdminUserSuccess,
	addSuperAdminUserFail,
	updateSuperAdminUserSuccess,
	updateSuperAdminUserFail,
	getAdminChildrenSuccess,
	getAdminChildrenFail,
} from './actions';
import {
	GET_ADMINS_DATA,
	ADD_SUPER_ADMIN_USER,
	UPDATE_SUPER_ADMIN_USER,
	GET_ADMIN_CHILDREN,
} from './actionTypes';

import { getAllAdminsList, getAdminChildren } from '../../network/getRequests';
import { addSuperAdminUser, updateAdmin } from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';
import { formPageTitle } from '../../components/Common/constants';

function* getAllAdmins(action) {
	try {
		const { data } = yield getAllAdminsList(action.payload);
		yield put(getAllAdminsSuccess(data?.data));
	} catch (error) {
		yield put(getAllAdminsFail(error?.response?.data?.errors[0]?.description));
	}
}

function* addSuperAdminUserWorker(action) {
	try {
		const { data, navigate } = action && action.payload;

		const adminRole = data?.role;

		delete data.role;
		yield addSuperAdminUser(data);

		showToastr({
			message: `${adminRole || ''} Created Successfully`,
			type: 'success',
		});

		yield put(addSuperAdminUserSuccess());
		window.localStorage.removeItem(formPageTitle.staff);

		if (navigate) yield navigate('/staff');
	} catch (e) {
		yield put(addSuperAdminUserFail());
	}
}

function* updateSuperAdminUserWorker(action) {
	try {
		const { data, navigate } = action && action.payload;

		yield updateAdmin(data);

		showToastr({
			message: `${data?.role} Updated Successfully`,
			type: 'success',
		});

		yield put(updateSuperAdminUserSuccess());

		if (navigate) yield navigate('/staff');
	} catch (e) {
		yield put(updateSuperAdminUserFail());
	}
}

const setChildren = (adminHierarchy) => {
	if (isEmpty(adminHierarchy)) return [];
	return (
		adminHierarchy?.children?.map((item) => ({
			id: item.id,
			name: `${item.firstName || item.username} (${
				item.childCount || item?.children?.length || 0
			})`,
			children: setChildren(item),
			data: item,
		})) || []
	);
};

function* getAdminChildrenWorker() {
	try {
		const { data } = yield getAdminChildren();
		const { admin } = data.data;
		const adminHierarchy = {
			...admin,
			name: `${admin.firstName || admin.username} (${
				admin.childCount || admin?.children?.length || 0
			})`,
			children: setChildren(data?.data?.admin),
		};
		yield put(getAdminChildrenSuccess(adminHierarchy));
	} catch (e) {
		yield put(getAdminChildrenFail());
	}
}

export function* watchGetAdminsData() {
	yield takeLatest(GET_ADMINS_DATA, getAllAdmins);
	yield takeEvery(ADD_SUPER_ADMIN_USER, addSuperAdminUserWorker);
	yield takeEvery(UPDATE_SUPER_ADMIN_USER, updateSuperAdminUserWorker);
	yield takeEvery(GET_ADMIN_CHILDREN, getAdminChildrenWorker);
}

function* AdminDetailsSaga() {
	yield all([fork(watchGetAdminsData)]);
}

export default AdminDetailsSaga;
