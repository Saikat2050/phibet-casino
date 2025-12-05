import {
	GET_PAYMENT_DATA,
	GET_PAYMENT_DATA_SUCCESS,
	GET_PAYMENT_DATA_FAIL,
	CREATE_PAYMENT_PROVIDER,
	CREATE_PAYMENT_SUCCESS,
	CREATE_PAYMENT_FAIL,
	RESET_PAYMENT_DETAILS,
	GET_PAYMENT_DETAILS,
	GET_PAYMENT_DETAILS_SUCCESS,
	GET_PAYMENT_DETAILS_FAIL,
	UPDATE_PAYMENT_PROVIDER,
	UPDATE_PAYMENT_FAIL,
	UPDATE_PAYMENT_SUCCESS,
	GET_PAYMENT_PROVIDER_DATA_SUCCESS,
	GET_PAYMENT_PROVIDER_DATA_FAIL,
	GET_PAYMENT_PROVIDER_DATA,
	ADD_PAYMENT_PROVIDER,
	ADD_PAYMENT_SUCCESS,
	ADD_PAYMENT_FAIL,
	UPDATE_PAYMENT_CREDENTIALS_PROVIDER,
	UPDATE_PAYMENT_CREDENTIALS_SUCCESS,
	UPDATE_PAYMENT_CREDENTIALS_FAILS,
	GET_PAYMENT_AGGREGATOR_START,
	GET_PAYMENT_AGGREGATOR_SUCCESS,
	GET_PAYMENT_AGGREGATOR_FAIL,
} from './actionTypes';

const INIT_STATE = {
	isLoading: true,
	paymentListing: {
		paymentProviders: [],
	},
	createSuccess: false,
	createLoading: false,
	updateSuccess: false,
	updateLoading: false,
	paymentDetailsLoading: false,
	paymentDetails: null,
	paymentProviderData: {
		providerCredentials: [],
	},
	isLoadinpaymentProvider: false,
	paymentAggregators: null,
	isPaymentAggregators: false,
};

const getPayments = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_PAYMENT_DATA:
			return {
				...state,
				isLoading: true,
			};

		case GET_PAYMENT_DATA_SUCCESS: {
			const { data, typeOfAction } = payload;
			const { paymentProviders, ...rest } = data;
			if (typeOfAction) {
				return {
					...state,
					isLoading: false,
					paymentListing: {
						paymentProviders: [
							...state.paymentListing.paymentProviders,
							...paymentProviders,
						],
						...rest,
					},
				};
			}
			return {
				...state,
				isLoading: false,
				paymentListing: {
					paymentProviders: [...paymentProviders],
					...rest,
				},
			};
		}

		case GET_PAYMENT_DATA_FAIL:
			return {
				...state,
				isLoading: false,
				paymentListing: {
					paymentProviders: [],
				},
			};

		case CREATE_PAYMENT_PROVIDER:
			return {
				...state,
				createLoading: true,
			};

		case CREATE_PAYMENT_SUCCESS:
			return {
				...state,
				createLoading: false,
				createSuccess: payload,
			};

		case CREATE_PAYMENT_FAIL:
			return {
				...state,
				createLoading: false,
				createSuccess: false,
			};

		case GET_PAYMENT_DETAILS:
			return {
				...state,
				paymentDetailsLoading: true,
			};

		case GET_PAYMENT_DETAILS_SUCCESS:
			return {
				...state,
				paymentDetailsLoading: false,
				paymentDetails: payload,
			};

		case GET_PAYMENT_DETAILS_FAIL:
			return {
				...state,
				paymentDetailsLoading: false,
			};

		case RESET_PAYMENT_DETAILS:
			return {
				createSuccess: false,
				createLoading: false,
				updateSuccess: false,
				updateLoading: false,
				paymentDetailsLoading: false,
				paymentDetails: null,
			};

		case UPDATE_PAYMENT_PROVIDER:
			return {
				...state,
				updateLoading: true,
			};

		case UPDATE_PAYMENT_SUCCESS:
			return {
				...state,
				updateLoading: false,
				updateSuccess: payload,
			};

		case UPDATE_PAYMENT_FAIL:
			return {
				...state,
				updateLoading: false,
				updateSuccess: false,
			};
		case GET_PAYMENT_PROVIDER_DATA:
			return {
				...state,
				isLoadinpaymentProvider: true,
			};

		case GET_PAYMENT_PROVIDER_DATA_SUCCESS: {
			const { data, TypeOfAction } = payload;
			const { providerCredentials, ...rest } = data;
			if (TypeOfAction === 'appendData') {
				return {
					...state,
					isLoadingPaymentProvider: false,
					paymentProviderData: {
						providerCredentials: [
							...state.paymentProviderData.providerCredentials,
							...providerCredentials,
						],
						...rest,
					},
				};
			}
			return {
				...state,
				isLoadingPaymentProvider: false,
				paymentProviderData: {
					providerCredentials: [...providerCredentials],
					...rest,
				},
			};
		}
		case GET_PAYMENT_PROVIDER_DATA_FAIL:
			return {
				...state,
				isLoadinpaymentProvider: false,
				paymentProviderData: {
					providerCredentials: [],
				},
			};
		case ADD_PAYMENT_PROVIDER:
			return {
				...state,
				createLoading: true,
			};

		case ADD_PAYMENT_SUCCESS:
			return {
				...state,
				createLoading: false,
			};

		case ADD_PAYMENT_FAIL:
			return {
				...state,
				createLoading: false,
			};
		case UPDATE_PAYMENT_CREDENTIALS_PROVIDER:
			return {
				...state,
				updateLoading: true,
			};

		case UPDATE_PAYMENT_CREDENTIALS_SUCCESS:
			return {
				...state,
				updateLoading: false,
			};

		case UPDATE_PAYMENT_CREDENTIALS_FAILS:
			return {
				...state,
				updateLoading: false,
			};

		case GET_PAYMENT_AGGREGATOR_START:
			return {
				...state,
				isPaymentAggregators: true,
			};

		case GET_PAYMENT_AGGREGATOR_SUCCESS:
			return {
				...state,
				paymentAggregators: payload,
				isPaymentAggregators: false,
			};

		case GET_PAYMENT_AGGREGATOR_FAIL:
			return {
				...state,
				isPaymentAggregators: false,
			};

		default:
			return {
				...state,
			};
	}
};

export default getPayments;
