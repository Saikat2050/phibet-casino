import { call, put, takeEvery } from 'redux-saga/effects';
import { Buffer } from 'buffer';

// Login Redux States
import moment from 'moment';
import { LOGIN_USER, LOGOUT_USER } from './actionTypes';
import { apiError, loginSuccess } from './actions';

// Include Both Helper File with needed methods
import { superAdminLogin } from '../../../network/postRequests';
import { setItem, setLoginToken } from '../../../network/storageUtils';

function* loginUser({ payload: { user, history } }) {
	try {
		const encryptedPass = Buffer.from(user.password).toString('base64');
		const res = yield call(superAdminLogin, {
			emailOrUsername: user.emailOrUsername,
			password: encryptedPass,
		});
		const {
			data: { data },
		} = res;
		const { accessToken } = data;

		setLoginToken(accessToken);
		setItem('role', 'Admin');
		yield put(loginSuccess(data));
		localStorage.setItem(
			'loggedInTime',
			moment().format('YYYY-MM-DD HH:mm:ss')
		);
		history('/dashboard');
	} catch (error) {
		const err =
			error?.response?.data?.errors?.[0]?.description || 'Failed to login';
		yield put(apiError(err, error.message));
		// yield put(apiError(error.message));
	}
}

function* logoutUser({ payload: { history } }) {
	try {
		localStorage.removeItem('authUser');
		history('/login');
	} catch (error) {
		yield put(apiError(error));
	}
}

function* authSaga() {
	yield takeEvery(LOGIN_USER, loginUser);
	yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
