import { SHOW_LINEAR_PROGRESS, RESET_LINEAR_PROGRESS } from './actionTypes';

const INIT_STATE = {
	showLinearProgress: false,
};

const progressLoading = (state = INIT_STATE, { type } = {}) => {
	switch (type) {
		case SHOW_LINEAR_PROGRESS:
			return {
				...state,
				showLinearProgress: true,
			};

		case RESET_LINEAR_PROGRESS:
			return {
				...INIT_STATE,
			};

		default:
			return { ...state };
	}
};

export default progressLoading;
