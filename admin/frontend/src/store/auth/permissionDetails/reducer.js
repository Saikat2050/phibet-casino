import {
	SUPER_ADMIN_START,
	SUPER_ADMIN_SUCCESS,
	SUPER_ADMIN_FAIL,
} from './actionTypes';

const initialState = {
	isAdminLoading: false,
	error: '',
	superAdminUser: '',
	isSuperAdminLoading: false,
	isSuperAdminError: '',
};

const permissionDetails = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case SUPER_ADMIN_START:
			return { ...state, isSuperAdminLoading: true };

		case SUPER_ADMIN_SUCCESS:
			return { ...state, superAdminUser: payload, isSuperAdminLoading: false };

		case SUPER_ADMIN_FAIL:
			return {
				...state,
				isSuperAdminError: payload,
				isSuperAdminLoading: false,
			};

		default:
			return { ...state };
	}
};

export default permissionDetails;
