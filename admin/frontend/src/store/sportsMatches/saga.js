import { call, put, takeEvery } from 'redux-saga/effects';

// Login Redux States
import {
	FETCH_SPORTS_MATCHES_START,
	UPDATE_SPORTS_FEATURED_MATCHES_START,
} from './actionTypes';
import {
	fetchSportsMatchesFail,
	fetchSportsMatchesSuccess,
	updateFeaturedMatchFail,
	updateFeaturedMatchSuccess,
} from './actions';
import { getSportsMatches } from '../../network/getRequests';
import { updateMatchFeaturedTemplate } from '../../network/postRequests';

function* fetchSportsMatches(action) {
	try {
		const payload = action && action.payload;
		const response = yield call(getSportsMatches, payload);
		yield put(fetchSportsMatchesSuccess(response?.data?.data));
	} catch (error) {
		yield put(fetchSportsMatchesFail(error));
	}
}

function* updateFeaturedMatches(action) {
	try {
		yield call(updateMatchFeaturedTemplate, action.payload);
		yield put(updateFeaturedMatchSuccess(action.payload));
	} catch (error) {
		yield put(updateFeaturedMatchFail(error));
	}
}

function* sportsMatchesSaga() {
	yield takeEvery(FETCH_SPORTS_MATCHES_START, fetchSportsMatches);
	yield takeEvery(UPDATE_SPORTS_FEATURED_MATCHES_START, updateFeaturedMatches);
}

export default sportsMatchesSaga;
