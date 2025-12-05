import {
	FETCH_DISPUTE_DETAILS,
	FETCH_DISPUTE_FAIL,
	FETCH_DISPUTE_SUCCESS,
	FETCH_DISPUTES_FAIL,
	FETCH_DISPUTES_START,
	FETCH_DISPUTES_SUCCESS,
	RESET_DISPUTES_DATA,
	SEND_MESSAGE,
	SEND_MESSAGE_FAIL,
	SEND_MESSAGE_SUCCESS,
	UPDATE_DISPUTE,
} from './actionTypes';

const initialState = {
	disputes: null,
	error: '',
	loading: true,

	disputeDetails: null,
	detailsLoading: false,
	detailsError: '',

	sendMessageLoading: false,
	sendMessageSuccess: false,
};

const disputesReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case FETCH_DISPUTES_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_DISPUTES_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_DISPUTES_SUCCESS:
			return {
				...state,
				loading: false,
				disputes: payload,
			};

		case FETCH_DISPUTE_DETAILS:
			return {
				...state,
				detailsLoading: true,
				loading: false,
			};
		case FETCH_DISPUTE_FAIL:
			return {
				...state,
				detailsLoading: false,
				error: true,
			};
		case FETCH_DISPUTE_SUCCESS:
			return {
				...state,
				detailsLoading: false,
				disputeDetails: payload,
			};

		case SEND_MESSAGE:
			return {
				...state,
				sendMessageSuccess: false,
				sendMessageLoading: true,
			};
		case SEND_MESSAGE_SUCCESS:
			return {
				...state,
				sendMessageSuccess: true,
				sendMessageLoading: false,
			};
		case SEND_MESSAGE_FAIL:
			return {
				...state,
				sendMessageSuccess: false,
				sendMessageLoading: false,
			};

		case RESET_DISPUTES_DATA:
			return {
				...state,
				loading: true,
				disputes: null,
				error: '',
			};

		case UPDATE_DISPUTE: {
			const { threadId } = payload;
			let tickets = [...(state?.disputes?.threadTickets || [])];
			const disputeDetails = { ...(state.disputeDetails || {}) };
			// eslint-disable-next-line eqeqeq
			if (disputeDetails?.id == threadId) {
				disputeDetails.threadMessages.push(payload);
			} else {
				tickets = tickets.map((dis) => {
					// eslint-disable-next-line eqeqeq
					if (dis.id == threadId) {
						return {
							...dis,
							unread_message_count: Number(dis.unread_message_count || 0) + 1,
						};
					}
					return dis;
				});
			}

			return {
				...state,
				disputes: { ...state.disputes, threadTickets: tickets },
				disputeDetails,
			};
		}
		default:
			return { ...state };
	}
};

export default disputesReducer;
