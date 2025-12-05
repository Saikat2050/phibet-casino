/* eslint-disable no-lonely-if */
import { call, put, takeEvery } from 'redux-saga/effects';
import { ADD_RESTRICTED_COUNTRIES_START } from './actionTypes';
import {
	addRestrictedCountriesFail,
	addRestrictedCountriesSuccess,
} from './actions';
import { showToastr } from '../../utils/helpers';
import {
	addGamesRestrictedCountries,
	addProviderRestrictedCountries,
	removeRestrictedCountriesGame,
	removeRestrictedCountriesProvider,
} from '../../network/putRequests';

function* addRestrictedCountriesWorker(action) {
	try {
		const payload = action && action.payload;
		const { data, navigate } = payload;
		const { type, operation } = data;
		delete data.type;
		delete data.case;

		if (type === 'providers') {
			if (operation === 'remove') {
				delete payload.operation;
				yield call(removeRestrictedCountriesProvider, data);
			} else {
				yield call(addProviderRestrictedCountries, data);
			}
		} else {
			if (operation === 'remove') {
				delete payload.operation;
				yield call(removeRestrictedCountriesGame, data);
			} else {
				yield call(addGamesRestrictedCountries, data);
			}
		}

		if (navigate) navigate(`/casino-${type}`);

		yield put(addRestrictedCountriesSuccess());
		showToastr({
			message: 'Restricted Countries Updated Successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(addRestrictedCountriesFail(error));
	}
}

function* restrictedCountriesSaga() {
	yield takeEvery(ADD_RESTRICTED_COUNTRIES_START, addRestrictedCountriesWorker);
}

export default restrictedCountriesSaga;
