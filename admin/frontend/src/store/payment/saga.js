/* eslint-disable no-param-reassign */
import { put, takeLatest, all, fork } from 'redux-saga/effects';
import { serialize } from 'object-to-formdata';
import {
	getPaymentListingSuccess,
	getPaymentListingFail,
	createPaymentSuccess,
	createPaymentFail,
	getPaymentDetailsSuccess,
	getPaymentDetailsFail,
	updatePaymentSuccess,
	updatePaymentFail,
	addPaymentProviderSuccess,
	addPaymentProviderFail,
	updatePaymentcredentialsSuccess,
	updatePaymentcredentialsFail,
	getPaymentcredentialsSuccess,
	getPaymentcredentialsFail,
	getPaymentAggregatorsSuccess,
	getPaymentAggregatorsFail,
} from './actions';
import {
	CREATE_PAYMENT_PROVIDER,
	GET_PAYMENT_DATA,
	GET_PAYMENT_DETAILS,
	UPDATE_PAYMENT_PROVIDER,
	ADD_PAYMENT_PROVIDER,
	UPDATE_PAYMENT_CREDENTIALS_PROVIDER,
	GET_PAYMENT_PROVIDER_DATA,
	GET_PAYMENT_AGGREGATOR_START,
} from './actionTypes';

import {
	getPaymentAggregators,
	getPaymentDetails,
	getPaymentList,
	getPaymentProviderDetails,
} from '../../network/getRequests';
import { showToastr } from '../../utils/helpers';
import {
	addProviderCredentials,
	createPaymentProvider,
	// updatePaymentProvider,
	updateProviderCredentials,
} from '../../network/postRequests';
import { filterEmptyPayload } from '../../network/networkUtils';
import { updatePaymentProvider } from '../../network/putRequests';

function* getPaymentWorker(action) {
	try {
		const { data } = yield getPaymentList(action.payload);
		if (action?.callBack) {
			yield put(
				getPaymentListingSuccess({
					data: data?.data,
					typeOfAction: 'appendData',
				})
			);
		} else {
			yield put(getPaymentListingSuccess({ data: data?.data }));
		}
	} catch (error) {
		yield put(
			getPaymentListingFail(error?.response?.data?.errors[0]?.description)
		);
	}
}

function* getPaymentDetailsWorker(action) {
	try {
		const { data } = yield getPaymentDetails(action.payload);
		yield put(getPaymentDetailsSuccess(data?.data?.paymentProvider));
	} catch (error) {
		yield put(
			getPaymentDetailsFail(error?.response?.data?.errors[0]?.description)
		);
	}
}

function* createPaymentProviderWorker({ payload }) {
	try {
		payload = serialize(filterEmptyPayload(payload), { indices: true });
		yield createPaymentProvider(payload);
		yield put(createPaymentSuccess(true));
		showToastr({
			message: 'Provider created successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(createPaymentFail());
	}
}

function* updatePaymentProviderWorker({ payload }) {
	try {
		payload = serialize(filterEmptyPayload(payload), { indices: true });
		yield updatePaymentProvider(payload);
		yield put(updatePaymentSuccess(true));
		showToastr({
			message: 'Provider updated successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(updatePaymentFail());
	}
}

function* getPaymentProviderWorker({ payload }) {
	try {
		const { data } = yield getPaymentProviderDetails(payload);
		yield put(
			getPaymentcredentialsSuccess({
				TypeOfAction: 'appendData',
				data: data?.data,
			})
		);
	} catch (error) {
		yield put(
			getPaymentcredentialsFail(error?.response?.data?.errors[0]?.description)
		);
	}
}

function* addPaymentProviderWorker({ payload }) {
	// const perPage = payload?.providerCredentialsLength;
	try {
		payload = serialize(filterEmptyPayload(payload?.data), { indices: true });
		yield addProviderCredentials(payload);
		const { data } = yield getPaymentProviderDetails({
			perPage: 10,
			page: payload?.page ?? 1,
		});
		yield put(
			getPaymentcredentialsSuccess({
				TypeOfAction: 'notAppendData',
				data: data?.data,
			})
		);
		yield put(addPaymentProviderSuccess(true));

		showToastr({
			message: 'Provider created successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(addPaymentProviderFail());
	}
}

function* UpdatePaymentProviderWorker({ payload }) {
	const perPage = payload?.providerCredentialsLength;
	try {
		payload = serialize(filterEmptyPayload(payload?.data), { indices: true });
		yield updateProviderCredentials(payload);
		const { data } = yield getPaymentProviderDetails({
			perPage,
			page: 1,
		});
		yield put(
			getPaymentcredentialsSuccess({
				TypeOfAction: 'notAppendData',
				data: data?.data,
			})
		);
		yield put(updatePaymentcredentialsSuccess(true));
		showToastr({
			message: 'Provider updated successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(updatePaymentcredentialsFail());
	}
}

function* getPaymentAggregatorsWorker() {
	try {
		const { data } = yield getPaymentAggregators();
		yield put(getPaymentAggregatorsSuccess({ data: data?.data }));
	} catch (error) {
		yield put(
			getPaymentAggregatorsFail(error?.response?.data?.errors[0]?.description)
		);
	}
}

export function* watchPaymentsData() {
	yield takeLatest(GET_PAYMENT_DATA, getPaymentWorker);
	yield takeLatest(CREATE_PAYMENT_PROVIDER, createPaymentProviderWorker);
	yield takeLatest(UPDATE_PAYMENT_PROVIDER, updatePaymentProviderWorker);
	yield takeLatest(GET_PAYMENT_DETAILS, getPaymentDetailsWorker);
	yield takeLatest(GET_PAYMENT_PROVIDER_DATA, getPaymentProviderWorker);
	yield takeLatest(ADD_PAYMENT_PROVIDER, addPaymentProviderWorker);
	yield takeLatest(
		UPDATE_PAYMENT_CREDENTIALS_PROVIDER,
		UpdatePaymentProviderWorker
	);
	yield takeLatest(GET_PAYMENT_AGGREGATOR_START, getPaymentAggregatorsWorker);
}

function* PaymentsSaga() {
	yield all([fork(watchPaymentsData)]);
}

export default PaymentsSaga;
