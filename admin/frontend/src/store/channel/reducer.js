import {
	GET_CHANNELS_SUCCESS,
	GET_CHANNELS_FAIL,
	GET_CHANNELS,
	GET_CHANNEL_MESSAGES_SUCCESS,
	GET_CHANNEL_MESSAGES_FAIL,
	GET_CHANNEL_MESSAGES,
	EDIT_CHANNEL_SUCCESS,
	EDIT_CHANNEL_FAIL,
	EDIT_CHANNEL,
	CREATE_CHANNEL_SUCCESS,
	CREATE_CHANNEL_FAIL,
	CREATE_CHANNEL,
} from './actionTypes';

const INIT_STATE = {
	channels: null,
	error: null,
	isLoading: true,
	isChannelDetailsLoading: false,
	isChannelUpdateLoading: false,
	channelMesages: null,
	totalChannelsPages: null,
};

const Channel = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_CHANNELS:
			return {
				...state,
				isLoading: true,
			};

		case GET_CHANNELS_SUCCESS:
			return {
				...state,
				isLoading: false,
				channels: payload?.groups,
				totalChannelsPages: payload?.totalPages,
				error: null,
			};

		case GET_CHANNELS_FAIL:
			return {
				...state,
				error: payload,
				isLoading: false,
			};

		case GET_CHANNEL_MESSAGES:
			return {
				...state,
				isChannelDetailsLoading: true,
			};

		case GET_CHANNEL_MESSAGES_SUCCESS:
			return {
				...state,
				channelMesages: payload,
				error: null,
				isChannelDetailsLoading: false,
			};

		case GET_CHANNEL_MESSAGES_FAIL:
			return {
				...state,
				error: payload,
				isChannelDetailsLoading: false,
			};

		case EDIT_CHANNEL:
			return {
				...state,
				isChannelUpdateLoading: true,
			};

		case EDIT_CHANNEL_SUCCESS:
			return {
				...state,
				isChannelUpdateLoading: false,
			};

		case EDIT_CHANNEL_FAIL:
			return {
				...state,
				error: payload,
				isChannelUpdateLoading: false,
			};

		case CREATE_CHANNEL:
			return {
				...state,
				isChannelUpdateLoading: true,
			};

		case CREATE_CHANNEL_SUCCESS:
			return {
				...state,
				isChannelUpdateLoading: false,
			};

		case CREATE_CHANNEL_FAIL:
			return {
				...state,
				error: payload,
				isChannelUpdateLoading: false,
			};

		default:
			return { ...state };
	}
};

export default Channel;
