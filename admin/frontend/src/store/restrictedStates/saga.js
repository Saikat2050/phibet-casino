/* eslint-disable no-lonely-if */
import { call, put, takeEvery } from 'redux-saga/effects';
import { ADD_RESTRICTED_STATES_START } from './actionTypes';
import { addRestrictedStatesFail, addRestrictedStatesSuccess } from './actions';
import { showToastr } from '../../utils/helpers';
import {
	addProviderRestrictedStates,
	removeRestrictedStatesProvider,
	addGamesRestrictedStates,
	removeRestrictedStatesGame,
} from '../../network/putRequests';

function* addRestrictedStatesWorker(action) {
	try {
		const payload = action && action.payload;
		const { data, navigate } = payload;
		const { type, operation } = data;
		delete data.type;
		delete data.case;

		if (type === 'providers') {
			if (operation === 'remove') {
				delete payload.operation;
				yield call(removeRestrictedStatesProvider, data);
			} else {
				yield call(addProviderRestrictedStates, data);
			}
		} else {
			if (operation === 'remove') {
				delete payload.operation;
				yield call(removeRestrictedStatesGame, data);
			} else {
				yield call(addGamesRestrictedStates, data);
			}
		}

		if (navigate) navigate(`/casino-${type}`);

		yield put(addRestrictedStatesSuccess());
		showToastr({
			message: 'Restricted States Updated Successfully',
			type: 'success',
		});
	} catch (error) {
		yield put(addRestrictedStatesFail(error));
	}
}

function* restrictedStatesSaga() {
	yield takeEvery(ADD_RESTRICTED_STATES_START, addRestrictedStatesWorker);
}

export default restrictedStatesSaga;
