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

export const getAllPackagesSuccess = (payload) => ({
	type: GET_ALL_PACKAGES_SUCCESS,
	payload,
});

export const getAllPackagesFail = (payload) => ({
	type: GET_ALL_PACKAGES_FAIL,
	payload,
});

export const getAllPackages = (payload) => ({
	type: GET_ALL_PACKAGES,
	payload,
});

export const getPackageSuccess = (payload) => ({
	type: GET_PACKAGE_SUCCESS,
	payload,
});

export const getPackageFail = (payload) => ({
	type: GET_PACKAGE_FAIL,
	payload,
});

export const getPackage = (payload) => ({
	type: GET_PACKAGE,
	payload,
});

export const createPackageSuccess = (payload) => ({
	type: CREATE_PACKAGE_SUCCESS,
	payload,
});

export const createPackageFail = (payload) => ({
	type: CREATE_PACKAGE_FAIL,
	payload,
});

export const createPackage = (payload) => ({
	type: CREATE_PACKAGE,
	payload,
});

export const updatePackageSuccess = (payload) => ({
	type: UPDATE_PACKAGE_SUCCESS,
	payload,
});

export const updatePackageFail = (payload) => ({
	type: UPDATE_PACKAGE_FAIL,
	payload,
});

export const updatePackage = (payload) => ({
	type: UPDATE_PACKAGE,
	payload,
});

export const deletePackageSuccess = (payload) => ({
	type: DELETE_PACKAGE_SUCCESS,
	payload,
});

export const deletePackageFail = (payload) => ({
	type: DELETE_PACKAGE_FAIL,
	payload,
});

export const deletePackage = (payload) => ({
	type: DELETE_PACKAGE,
	payload,
});

export const reorderPackageSuccess = (payload) => ({
	type: REORDER_PACKAGE_SUCCESS,
	payload,
});

export const reorderPackageFail = (payload) => ({
	type: REORDER_PACKAGE_FAIL,
	payload,
});

export const reorderPackage = (payload) => ({
	type: REORDER_PACKAGE,
	payload,
});
