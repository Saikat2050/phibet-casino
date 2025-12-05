/* eslint-disable no-param-reassign */
import { put, takeLatest, all, fork } from 'redux-saga/effects';
import {
	getChannelsSuccess,
	getChannelsFailure,
	getChannelMessagesSuccess,
	getChannelMessagesFailure,
	editChannelFailure,
	editChannel,
} from './actions';
import {
	GET_CHANNELS,
	GET_CHANNEL_MESSAGES,
	EDIT_CHANNEL,
	CREATE_CHANNEL,
} from './actionTypes';

import { getAllChannels, getChannelMessages } from '../../network/getRequests';
import { updateChannel } from '../../network/putRequests';
import { showToastr } from '../../utils/helpers';
import { createChannel } from '../../network/postRequests';
import { createChannelFailure, createChannelSuccess } from '../actions';

function* getChannelListingWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getAllChannels(payload);

		yield put(getChannelsSuccess(data?.data));
	} catch (error) {
		yield put(
			getChannelsFailure(error?.response?.data?.errors?.[0]?.description)
		);
	}
}

function* updateChannelWorker(action) {
	try {
		const { data, navigate } = action && action.payload;
		const { response } = yield updateChannel(data);

		yield put(
			editChannel({
				response,
			})
		);

		showToastr({
			message: `Channel Created Successfully`,
			type: 'success',
		});
		if (navigate) {
			navigate('/chat/channels');
		}
	} catch (e) {
		showToastr({
			message: e?.response?.data?.errors[0]?.description || e.message,
			type: 'error',
		});

		yield put(editChannelFailure());
	}
}

function* createChannelWorker(action) {
	try {
		const { data, navigate } = action && action.payload;

		const { response } = yield createChannel(data);

		yield put(
			createChannelSuccess({
				response,
			})
		);

		showToastr({
			message: `Status Updated Successfully`,
			type: 'success',
		});
		if (navigate) {
			navigate('/chat/channels');
		}
	} catch (e) {
		showToastr({
			message: e?.response?.data?.errors[0]?.description || e.message,
			type: 'error',
		});

		yield put(createChannelFailure());
	}
}

function* getChannelMessagesStartWorker(action) {
	try {
		const params = action && action.payload;
		const { data } = yield getChannelMessages(params);
		yield put(getChannelMessagesSuccess(data?.data?.records));
	} catch (error) {
		showToastr({
			message: error?.response?.data?.errors[0]?.description || error.message,
			type: 'error',
		});
		yield put(
			getChannelMessagesFailure(error?.response?.data?.errors[0]?.description)
		);
	}
}

export function* watchBonusData() {
	yield takeLatest(GET_CHANNEL_MESSAGES, getChannelMessagesStartWorker);
	yield takeLatest(GET_CHANNELS, getChannelListingWorker);
	yield takeLatest(EDIT_CHANNEL, updateChannelWorker);
	yield takeLatest(CREATE_CHANNEL, createChannelWorker);
}

function* ChannelSaga() {
	yield all([fork(watchBonusData)]);
}

export default ChannelSaga;
