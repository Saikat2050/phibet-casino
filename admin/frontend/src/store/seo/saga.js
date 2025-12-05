import { put, takeLatest, fork, all, call } from 'redux-saga/effects';

//  Redux States
import {
	CREATE_SEO_ROUTE_START,
	DELETE_SEO_ROUTE_START,
	GET_ALL_SEO_ROUTES_START,
	GET_SEO_ROUTE_START,
	UPDATE_SEO_ROUTE_START,
} from './actionTypes';
import {
	getAllSeoRoutesSuccess,
	getAllSeoRoutesFail,
	createSeoRouteSuccess,
	createSeoRouteFail,
	updateSeoRouteSuccess,
	updateSeoRouteFail,
	deleteSeoRouteSuccess,
	getASeoRouteSuccess,
	getASeoRouteFail,
} from './actions';
import { getASeoRoute, getSeoRoutes } from '../../network/getRequests';
import { createSeoRoute } from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';
import { deleteSeoRoute } from '../../network/deleteRequests';
import { updateSeoRoute } from '../../network/putRequests';

function* getSeoRoutesWorker(actions) {
	const payload = actions && actions.payload;
	try {
		const response = yield call(getSeoRoutes, payload);

		yield put(getAllSeoRoutesSuccess(response?.data?.data));
	} catch (e) {
		yield put(getAllSeoRoutesFail(e?.response?.data?.errors[0]?.description));
	}
}

function* getSeoRouteDetailsWorker(actions) {
	const payload = actions && actions.payload;
	try {
		const response = yield call(getASeoRoute, payload);

		yield put(getASeoRouteSuccess(response?.data?.data));
	} catch (e) {
		yield put(getASeoRouteFail(e?.response?.data?.errors[0]?.description));
	}
}

function* createSeoRoutesWorker(action) {
	try {
		const data = action && action.payload.payload;
		const response = yield call(createSeoRoute, data);

		yield put(createSeoRouteSuccess(response?.data?.data));

		showToastr({
			message: `Route Created Successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(createSeoRouteFail(e?.response?.data?.errors[0]?.description));
	}
}

function* updateSeoRoutesWorker(action) {
	try {
		const data = action && action.payload.data;
		const response = yield call(updateSeoRoute, data);

		yield put(updateSeoRouteSuccess(response?.data?.data));

		showToastr({
			message: `Route Updated Successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(updateSeoRouteFail(e?.response?.data?.errors[0]?.description));
	}
}

function* deleteRoutesWorker(actions) {
	const payload = actions && actions.payload;
	try {
		const response = yield call(deleteSeoRoute, payload);

		yield put(deleteSeoRouteSuccess(response?.data?.data));

		showToastr({
			message: `Route Deleted Successfully`,
			type: 'success',
		});
	} catch (e) {
		yield put(deleteSeoRouteSuccess(e?.response?.data?.errors[0]?.description));
	}
}

export function* SeoDataWatcher() {
	yield takeLatest(GET_ALL_SEO_ROUTES_START, getSeoRoutesWorker);
	yield takeLatest(GET_SEO_ROUTE_START, getSeoRouteDetailsWorker);
	yield takeLatest(CREATE_SEO_ROUTE_START, createSeoRoutesWorker);
	yield takeLatest(UPDATE_SEO_ROUTE_START, updateSeoRoutesWorker);
	yield takeLatest(DELETE_SEO_ROUTE_START, deleteRoutesWorker);
}

function* SeoDataSaga() {
	yield all([fork(SeoDataWatcher)]);
}

export default SeoDataSaga;
