import {
	ADD_RESTRICTED_STATES_FAIL,
	ADD_RESTRICTED_STATES_START,
	ADD_RESTRICTED_STATES_SUCCESS,
} from './actionTypes';

const initialState = {
	addToRestrictedStatesSuccess: null,
	addToRestrictedStatesError: '',
	addToRestrictedStatesLoading: false,
};

const restrictedStatesReducer = (state = initialState, { type } = {}) => {
	switch (type) {
		case ADD_RESTRICTED_STATES_START: {
			return {
				...state,
				addToRestrictedStatesLoading: true,
			};
		}

		case ADD_RESTRICTED_STATES_FAIL:
			return {
				...state,
				addToRestrictedStatesSuccess: false,
				addToRestrictedStatesError: true,
				addToRestrictedStatesLoading: false,
			};

		case ADD_RESTRICTED_STATES_SUCCESS:
			return {
				...state,
				addToRestrictedStatesSuccess: true,
				addToRestrictedStatesError: false,
				addToRestrictedStatesLoading: false,
			};

		default:
			return state;
	}
};

export default restrictedStatesReducer;
