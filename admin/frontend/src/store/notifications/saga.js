/* eslint-disable no-param-reassign */
import { call, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import { FETCH_NOTIFICATIONS_START, NOTIFY_PLAYERS_START } from './actionTypes';
import {
	fetchNotificationsFail,
	fetchNotificationsSuccess,
	notifyPlayersFail,
	notifyPlayersSuccess,
} from './actions';
import { getNotifications } from '../../network/getRequests';
import { notifyPlayersRequest } from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';
import { objectToFormData } from '../../utils/objectToFormdata';

function* fetchNotifications({ payload }) {
	try {
		const response = yield call(getNotifications, payload);
		yield put(fetchNotificationsSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchNotificationsFail(error));
	}
}

function* notifyPlayersWorker(action) {
	try {
		const { payload, navigate } = action && action.payload;
		yield notifyPlayersRequest(objectToFormData(payload));

		showToastr({
			message: `Notification sent successfully!`,
			type: 'success',
		});

		if (navigate) {
			navigate('/notifications');
		}

		yield put(notifyPlayersSuccess());
	} catch (e) {
		yield put(notifyPlayersFail());
	}
}

function* NotificationsSaga() {
	yield takeEvery(FETCH_NOTIFICATIONS_START, fetchNotifications);
	yield takeEvery(NOTIFY_PLAYERS_START, notifyPlayersWorker);
}

export default NotificationsSaga;
