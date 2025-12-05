import { call, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import { FETCH_SPORTS_MARKETS_START } from './actionTypes';
import { fetchSportsMarketsFail, fetchSportsMarketsSuccess } from './actions';
import { getSportsMarkets } from '../../network/getRequests';

function* fetchSportsMarkets(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getSportsMarkets, payload);
		yield put(fetchSportsMarketsSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchSportsMarketsFail(error));
	}
}

function* sportMarketsSaga() {
	yield takeEvery(FETCH_SPORTS_MARKETS_START, fetchSportsMarkets);
}

export default sportMarketsSaga;
