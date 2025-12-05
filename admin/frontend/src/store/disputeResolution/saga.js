import { call, put, select, takeLatest } from 'redux-saga/effects';

// Login Redux States
import {
	FETCH_DISPUTE_DETAILS,
	FETCH_DISPUTES_START,
	SEND_MESSAGE,
	UPDATE_DISPUTE_STATUS,
} from './actionTypes';
import {
	fetchDisputeDetails,
	fetchDisputeFail,
	fetchDisputesFail,
	fetchDisputesSuccess,
	fetchDisputeSuccess,
	sendMessageSuccess,
} from './actions';
import { getDisputeDetails, getDisputes } from '../../network/getRequests';
import { sendMessageRequest, updateStatus } from '../../network/postRequests';
import { showToastr } from '../../utils/helpers';

function* fetchDisputes({ payload }) {
	try {
		const response = yield call(getDisputes, payload);
		yield put(fetchDisputesSuccess(response.data.data));
	} catch (error) {
		yield put(fetchDisputesFail(error));
	}
}

function* fetchDisputeDetailsWorker({ payload }) {
	try {
		const response = yield call(getDisputeDetails, payload);
		const disputes = yield select((state) => state.Disputes?.disputes);
		yield put(fetchDisputeSuccess(response.data.data?.threadMessages));
		const updatedDisputes = {
			...disputes,
			threadTickets: disputes?.threadTickets?.map((thread) => {
				if (thread.id === payload.threadId) {
					return {
						...thread,
						unread_message_count: '0',
					};
				}
				return thread;
			}),
		};
		yield put(fetchDisputesSuccess(updatedDisputes));
	} catch (err) {
		yield put(fetchDisputeFail(err));
	}
}

function* sendMessageWorker({ payload: { data, resetForm } }) {
	try {
		yield call(sendMessageRequest, data);

		if (typeof resetForm === 'function') {
			resetForm();
		}
		yield put(fetchDisputeDetails({ threadId: data.threadId }));
		yield put(sendMessageSuccess());
	} catch (error) {
		yield put(fetchDisputesFail(error));
	}
}

function* updateDisputeStatus({ payload }) {
	try {
		yield call(updateStatus, payload);
		const disputes = yield select((state) => state.Disputes?.disputes);
		const updatedDisputes = {
			...disputes,
			threadTickets: disputes?.threadTickets?.map((thread) => {
				if (thread.id === payload.threadId) {
					return {
						...thread,
						status: payload.status,
					};
				}
				return thread;
			}),
		};

		showToastr({
			message: 'Status Updated Successfully',
			type: 'success',
		});

		yield put(fetchDisputesSuccess(updatedDisputes));
	} catch (err) {
		console.error('Error while updating status ', err?.message);
	}
}

function* disputesSaga() {
	yield takeLatest(FETCH_DISPUTES_START, fetchDisputes);
	yield takeLatest(FETCH_DISPUTE_DETAILS, fetchDisputeDetailsWorker);
	yield takeLatest(SEND_MESSAGE, sendMessageWorker);
	yield takeLatest(UPDATE_DISPUTE_STATUS, updateDisputeStatus);
}

export default disputesSaga;
