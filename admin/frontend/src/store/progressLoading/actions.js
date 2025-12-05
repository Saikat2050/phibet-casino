import { SHOW_LINEAR_PROGRESS, RESET_LINEAR_PROGRESS } from './actionTypes';

export const showLinearProgress = (payload) => ({
	type: SHOW_LINEAR_PROGRESS,
	payload,
});

export const resetLinearProgress = () => ({
	type: RESET_LINEAR_PROGRESS,
});
