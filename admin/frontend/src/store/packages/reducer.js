import {
	CREATE_PACKAGE,
	CREATE_PACKAGE_FAIL,
	CREATE_PACKAGE_SUCCESS,
	DELETE_PACKAGE,
	DELETE_PACKAGE_FAIL,
	DELETE_PACKAGE_SUCCESS,
	GET_ALL_PACKAGES,
	GET_ALL_PACKAGES_FAIL,
	GET_ALL_PACKAGES_SUCCESS,
	GET_PACKAGE,
	GET_PACKAGE_FAIL,
	GET_PACKAGE_SUCCESS,
	REORDER_PACKAGE,
	REORDER_PACKAGE_FAIL,
	REORDER_PACKAGE_SUCCESS,
	UPDATE_PACKAGE,
	UPDATE_PACKAGE_FAIL,
	UPDATE_PACKAGE_SUCCESS,
} from './actionTypes';

const INIT_STATE = {
	isPackagesLoading: false,
	packages: null,
	isError: null,
	isPackageInfoLoading: false,
	packageInfo: null,
	isPackageInfoError: null,
	createPackageSuccess: null,
	createPackageError: null,
	createPackageLoading: false,
	updatePackageSuccess: null,
	updatePackageError: null,
	updatePackageLoading: false,
	deletePackageSuccess: null,
	deletePackageError: null,
	deletePackageLoading: false,
	reorderPackageSuccess: null,
	reorderPackageError: null,
	reorderPackageLoading: false,
};

const getPackages = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_ALL_PACKAGES:
			return {
				...state,
				isPackagesLoading: true,
				packages: null,
				isError: null,
			};

		case GET_ALL_PACKAGES_SUCCESS: {
			return {
				...state,
				isPackagesLoading: false,
				packages: payload,
				isError: null,
			};
		}

		case GET_ALL_PACKAGES_FAIL:
			return {
				...state,
				isPackagesLoading: false,
				packages: null,
				isError: payload,
			};

		case GET_PACKAGE:
			return {
				...state,
				isPackageInfoLoading: true,
				packageInfo: null,
				isPackageInfoError: null,
			};

		case GET_PACKAGE_SUCCESS: {
			return {
				...state,
				isPackageInfoLoading: false,
				packageInfo: payload,
				isPackageInfoError: null,
			};
		}

		case GET_PACKAGE_FAIL:
			return {
				...state,
				isPackageInfoLoading: false,
				packageInfo: null,
				isPackageInfoError: payload,
			};

		case CREATE_PACKAGE:
			return {
				...state,
				createPackageLoading: true,
				createPackageSuccess: null,
				createPackageError: null,
			};

		case CREATE_PACKAGE_SUCCESS: {
			return {
				...state,
				createPackageLoading: false,
				createPackageSuccess: payload,
				createPackageError: null,
			};
		}

		case CREATE_PACKAGE_FAIL:
			return {
				...state,
				createPackageLoading: false,
				createPackageSuccess: null,
				createPackageError: payload,
			};

		case UPDATE_PACKAGE:
			return {
				...state,
				updatePackageLoading: true,
				updatePackageSuccess: null,
				updatePackageError: null,
			};

		case UPDATE_PACKAGE_SUCCESS: {
			return {
				...state,
				updatePackageLoading: false,
				updatePackageSuccess: payload,
				updatePackageError: null,
			};
		}

		case UPDATE_PACKAGE_FAIL:
			return {
				...state,
				updatePackageLoading: false,
				updatePackageSuccess: null,
				updatePackageError: payload,
			};

		case DELETE_PACKAGE:
			return {
				...state,
				deletePackageLoading: true,
				deletePackageSuccess: null,
				deletePackageError: null,
			};

		case DELETE_PACKAGE_SUCCESS: {
			return {
				...state,
				deletePackageLoading: false,
				deletePackageSuccess: payload,
				deletePackageError: null,
			};
		}

		case DELETE_PACKAGE_FAIL:
			return {
				...state,
				deletePackageLoading: false,
				deletePackageSuccess: null,
				deletePackageError: payload,
			};

		case REORDER_PACKAGE:
			return {
				...state,
				reorderPackageLoading: true,
				reorderPackageSuccess: null,
				reorderPackageError: null,
			};

		case REORDER_PACKAGE_SUCCESS:
			return {
				...state,
				reorderPackageLoading: false,
				reorderPackageSuccess: payload,
				reorderPackageError: null,
			};

		case REORDER_PACKAGE_FAIL:
			return {
				...state,
				reorderPackageLoading: false,
				reorderPackageSuccess: null,
				reorderPackageError: payload,
			};

		default:
			return { ...state };
	}
};

export default getPackages;
