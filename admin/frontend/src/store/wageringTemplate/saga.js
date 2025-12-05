import { put, takeLatest, all, fork } from 'redux-saga/effects';
import { showToastr } from '../../utils/helpers';
// Crypto Redux States
import {
	getWageringTemplateDetailSuccess,
	getWageringTemplateDetailFail,
	getWageringTemplateDetailsSuccess,
	getWageringTemplateDetailsFail,
	createWageringTemplateDetailsSuccess,
	createWageringTemplateDetailsFail,
	editWageringTemplateDetailsSuccess,
	editWageringTemplateDetailsFail,
} from './actions';

import {
	GET_WAGERING_TEMPLATE_DETAIL,
	GET_WAGERING_TEMPLATE_DETAILS,
	CREATE_WAGERING_TEMPLATE_DETAILS,
	EDIT_WAGERING_TEMPLATE_DETAILS,
} from './actionTypes';

import {
	getSuperAdminWageringTemplate,
	getSuperAdminWageringTemplateDetail,
} from '../../network/getRequests';
import {
	createWageringTemplate,
	updateWageringTemplate,
} from '../../network/postRequests';
import { formPageTitle } from '../../components/Common/constants';

function* getWageringTemplateDetailWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getSuperAdminWageringTemplate(payload);
		yield put(getWageringTemplateDetailsSuccess(data?.data));
	} catch (e) {
		yield put(getWageringTemplateDetailsFail(e.message));
	}
}

function* getSAWageringTemplateDetailWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getSuperAdminWageringTemplateDetail(payload);
		yield put(getWageringTemplateDetailSuccess(data?.data));
	} catch (e) {
		yield put(getWageringTemplateDetailFail(e.message));
	}
}

function* createWageringTemplateWorker(action) {
	try {
		const { templateData, navigate } = action && action.payload;
		yield createWageringTemplate(templateData);

		showToastr({
			message: `Created Wagering Template Successfully`,
			type: 'success',
		});

		window.localStorage.removeItem(formPageTitle.wageringTemplate);

		yield put(createWageringTemplateDetailsSuccess());

		if (navigate) yield navigate('/wagering-template');
	} catch (e) {
		showToastr({
			message: e?.response?.data?.errors[0]?.description,
			type: 'error',
		});
		yield put(createWageringTemplateDetailsFail());
	}
}

function* editWageringTemplateWorker(action) {
	try {
		const { templateData, navigate } = action && action.payload;
		yield updateWageringTemplate(templateData);

		showToastr({
			message: 'Record updated successfully',
			type: 'success',
		});

		yield put(editWageringTemplateDetailsSuccess());

		if (navigate) yield navigate('/wagering-template');
	} catch (e) {
		yield put(editWageringTemplateDetailsFail());
	}
}

function* wageringTemplateWatcher() {
	yield takeLatest(
		GET_WAGERING_TEMPLATE_DETAILS,
		getWageringTemplateDetailWorker
	);
	yield takeLatest(
		GET_WAGERING_TEMPLATE_DETAIL,
		getSAWageringTemplateDetailWorker
	);
	yield takeLatest(
		CREATE_WAGERING_TEMPLATE_DETAILS,
		createWageringTemplateWorker
	);
	yield takeLatest(EDIT_WAGERING_TEMPLATE_DETAILS, editWageringTemplateWorker);
}

function* WageringTemplateDetailsSaga() {
	yield all([fork(wageringTemplateWatcher)]);
}

export default WageringTemplateDetailsSaga;
