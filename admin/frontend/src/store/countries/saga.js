/* eslint-disable no-param-reassign */
import { call, put, takeEvery, select } from 'redux-saga/effects';

// Login Redux States
import {
	EDIT_COUNTRIES_START,
	FETCH_COUNTRIES_START,
	UPDATE_COUNTRIES_STATUS_START,
	FETCH_RESTRICTED_ITEMS_START,
	FETCH_UNRESTRICTED_ITEMS_START,
	REMOVE_RESTRICTED_ITEMS_START,
	ADD_RESTRICTED_ITEMS_START,
} from './actionTypes';

import {
	fetchCountriesFail,
	fetchCountriesSuccess,
	updateCountryStatusSuccess,
	updateCountryStatusFail,
	editCountryFail,
	editCountrySuccess,
	fetchRestrictedItemsSuccess,
	fetchRestrictedItemsFail,
	fetchUnrestrictedItemsSuccess,
	fetchUnrestrictedItemsFail,
	removeRestrictedItemsSuccess,
	removeRestrictedItemsFail,
	addRestrictedItemsSuccess,
	addRestrictedItemsFail,
} from './actions';

import {
	getCountries,
	getRestrictedItems,
	getUnrestrictedItems,
} from '../../network/getRequests';

import { addRestrictedItems } from '../../network/putRequests';

import { deleteRestrictedItems } from '../../network/deleteRequests';

import { showToastr } from '../../utils/helpers';
import {
	editCountryDetails,
	updateCountryStatus,
} from '../../network/postRequests';

function* fetchCountries({ payload }) {
	try {
		const response = yield call(getCountries, payload);
		yield put(fetchCountriesSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchCountriesFail(error));
	}
}

function* updateCountryStatusWorker(action) {
	try {
		const payload = action && action.payload;

		yield updateCountryStatus(payload);

		showToastr({
			message: 'Status updated Successfully',
			type: 'success',
		});

		const { countries } = yield select((state) => state.Countries);
		const updatedCountries = countries?.countries?.map((country) => {
			if (country?.id === payload.countryId) {
				country.isActive = !country.isActive;
			}
			return country;
		});

		yield put(
			fetchCountriesSuccess({
				...countries,
				countries: updatedCountries,
			})
		);

		yield put(updateCountryStatusSuccess());
	} catch (e) {
		yield put(updateCountryStatusFail());
	}
}

function* editCountryWorker(action) {
	try {
		const { data } = action && action.payload;

		yield editCountryDetails(data);

		showToastr({
			message: 'Country updated Successfully',
			type: 'success',
		});

		yield put(editCountrySuccess());
	} catch (e) {
		yield put(editCountryFail());
	}
}

function* getRestrictedItemsWorker(action) {
	try {
		const { payload } = action;

		const { data } = yield getRestrictedItems(payload);

		if (payload.type === 'games') {
			yield put(
				fetchRestrictedItemsSuccess(data?.data?.restrictedItems?.games)
			);
		} else {
			yield put(
				fetchRestrictedItemsSuccess(data?.data?.restrictedItems?.providers)
			);
		}
	} catch (e) {
		yield put(fetchRestrictedItemsFail());
	}
}

function* getUnRestrictedItemsWorker(action) {
	try {
		const { payload } = action;

		const { data } = yield getUnrestrictedItems(payload);

		if (payload.type === 'games') {
			yield put(
				fetchUnrestrictedItemsSuccess(data?.data?.restrictedItems?.games)
			);
		} else {
			yield put(
				fetchUnrestrictedItemsSuccess(data?.data?.restrictedItems?.providers)
			);
		}
	} catch (e) {
		yield put(fetchUnrestrictedItemsFail());
	}
}

function* removeRestrictedItemsWorker(action) {
	try {
		const { data, navigate } = action && action.payload;

		yield deleteRestrictedItems(data);

		showToastr({
			message: 'Restricted Items Deleted Successfully',
			type: 'success',
		});

		yield put(removeRestrictedItemsSuccess());

		navigate('/countries');
	} catch (e) {
		yield put(removeRestrictedItemsFail());
	}
}

function* addRestrictedItemsWorker(action) {
	try {
		const { data, navigate } = action && action.payload;

		yield addRestrictedItems(data);

		showToastr({
			message: 'Restricted Items Added Successfully',
			type: 'success',
		});

		yield put(addRestrictedItemsSuccess());

		navigate('/countries');
	} catch (e) {
		yield put(addRestrictedItemsFail());
	}
}

function* countriesSaga() {
	yield takeEvery(FETCH_COUNTRIES_START, fetchCountries);
	yield takeEvery(UPDATE_COUNTRIES_STATUS_START, updateCountryStatusWorker);
	yield takeEvery(EDIT_COUNTRIES_START, editCountryWorker);
	yield takeEvery(FETCH_RESTRICTED_ITEMS_START, getRestrictedItemsWorker);
	yield takeEvery(FETCH_UNRESTRICTED_ITEMS_START, getUnRestrictedItemsWorker);
	yield takeEvery(REMOVE_RESTRICTED_ITEMS_START, removeRestrictedItemsWorker);
	yield takeEvery(ADD_RESTRICTED_ITEMS_START, addRestrictedItemsWorker);
}

export default countriesSaga;
