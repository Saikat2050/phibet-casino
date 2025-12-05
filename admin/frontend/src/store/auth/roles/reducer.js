import { ROLES_ERROR, ROLES_START, ROLES_SUCCESS } from './actionTypes';

const initialState = {
	loading: false,
	error: '',
	roles: '',
	success: false,
};

const adminRoles = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case ROLES_START:
			return { ...state, loading: payload };
		case ROLES_SUCCESS:
			return { ...state, roles: payload, success: true, loading: false };
		case ROLES_ERROR:
			return { ...state, error: payload, success: false, loading: false };
		default:
			return { ...state };
	}
};

export default adminRoles;
