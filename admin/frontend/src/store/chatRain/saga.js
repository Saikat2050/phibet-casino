import { put, takeLatest, all, fork } from 'redux-saga/effects';
import {
	CREATE_CHATRAIN,
	GET_CHATRAIN_DATA,
	UPDATE_CHATRAIN,
} from './actionTypes';
import {
	createChatrainFail,
	createChatrainSuccess,
	getChatrainFail,
	getChatrainSuccess,
	updateChatrainFail,
	updateChatrainSuccess,
} from './actions';
import { getChatrain } from '../../network/getRequests';
import { createChatrain, updateChatrain } from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';

function* getChatrainWorker(action) {
	try {
		const { data } = yield getChatrain(action.payload);
		yield put(getChatrainSuccess(data?.data));
	} catch (error) {
		yield put(getChatrainFail(error?.response?.data?.errors?.[0]?.description));
	}
}

function* createChatrainWorker(action) {
	try {
		// const { data } = action?.payload;
		const { data } = action.payload ?? {};
		// const res = yield createChatrain(data);
		yield createChatrain(data);
		yield put(createChatrainSuccess(true));
		showToastr({
			message: 'Chat Rain created successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(createChatrainFail());
		showToastr({
			// message: error?.response?.data?.errors[0]?.description || e.message,
			message: error?.response?.data?.errors?.[0]?.description || error.message,
			type: 'error',
		});
	}
}

function* updateChatrainWorker(action) {
	try {
		// const { data } = action?.payload;
		const { data } = action.payload ?? {};
		// const res = yield updateChatrain(data);
		yield updateChatrain(data);
		yield put(updateChatrainSuccess(true));
		showToastr({
			message: 'Chat Rain updated successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(updateChatrainFail());
		showToastr({
			// message: error?.response?.data?.errors[0]?.description || e.message,
			message: error?.response?.data?.errors[0]?.description || error.message,
			type: 'error',
		});
	}
}

export function* watchChatrain() {
	yield takeLatest(GET_CHATRAIN_DATA, getChatrainWorker);
	yield takeLatest(CREATE_CHATRAIN, createChatrainWorker);
	yield takeLatest(UPDATE_CHATRAIN, updateChatrainWorker);
}

function* ChatrainSaga() {
	yield all([fork(watchChatrain)]);
}

export default ChatrainSaga;
