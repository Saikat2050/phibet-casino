import {
	FETCH_NOTIFICATIONS_FAIL,
	FETCH_NOTIFICATIONS_START,
	FETCH_NOTIFICATIONS_SUCCESS,
	RESET_NOTIFICATIONS_DATA,
	NOTIFY_PLAYERS_START,
	NOTIFY_PLAYERS_SUCCESS,
	NOTIFY_PLAYERS_FAIL,
} from './actionTypes';

const initialState = {
	notifications: null,
	error: '',
	loading: false,
	notifyPlayerLoading: false,
	notifyPlayerSuccess: false,
};

const notificationReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case FETCH_NOTIFICATIONS_START:
			return {
				...state,
				loading: true,
			};

		case FETCH_NOTIFICATIONS_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};

		case FETCH_NOTIFICATIONS_SUCCESS:
			return {
				...state,
				loading: false,
				notifications: payload,
			};

		case RESET_NOTIFICATIONS_DATA:
			return {
				...state,
				loading: false,
				notifications: null,
				error: '',
			};

		case NOTIFY_PLAYERS_START:
			return {
				...state,
				notifyPlayerLoading: true,
				notifyPlayerSuccess: false,
			};

		case NOTIFY_PLAYERS_SUCCESS:
			return {
				...state,
				notifyPlayerLoading: false,
				notifyPlayerSuccess: true,
			};
		case NOTIFY_PLAYERS_FAIL:
			return {
				...state,
				notifyPlayerLoading: false,
				notifyPlayerSuccess: false,
			};

		default:
			return { ...state };
	}
};

export default notificationReducer;
