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

export const getChannelsSuccess = (payload) => ({
	type: GET_CHANNELS_SUCCESS,
	payload,
});

export const getChannelsFailure = (payload) => ({
	type: GET_CHANNELS_FAIL,
	payload,
});

export const getChannels = (payload) => ({
	type: GET_CHANNELS,
	payload,
});

export const getChannelMessagesSuccess = (payload) => ({
	type: GET_CHANNEL_MESSAGES_SUCCESS,
	payload,
});
export const getChannelMessagesFailure = (payload) => ({
	type: GET_CHANNEL_MESSAGES_FAIL,
	payload,
});

export const getChannelMessages = (payload) => ({
	type: GET_CHANNEL_MESSAGES,
	payload,
});

export const editChannelSuccess = (payload) => ({
	type: EDIT_CHANNEL_SUCCESS,
	payload,
});

export const editChannelFailure = (payload) => ({
	type: EDIT_CHANNEL_FAIL,
	payload,
});

export const editChannel = (payload) => ({
	type: EDIT_CHANNEL,
	payload,
});

export const createChannelSuccess = (payload) => ({
	type: CREATE_CHANNEL_SUCCESS,
	payload,
});

export const createChannelFailure = (payload) => ({
	type: CREATE_CHANNEL_FAIL,
	payload,
});

export const createChannel = (payload) => ({
	type: CREATE_CHANNEL,
	payload,
});
