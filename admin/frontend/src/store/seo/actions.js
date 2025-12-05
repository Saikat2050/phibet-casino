import {
	CREATE_SEO_ROUTE_FAIL,
	CREATE_SEO_ROUTE_START,
	CREATE_SEO_ROUTE_SUCCESS,
	DELETE_SEO_ROUTE_FAIL,
	DELETE_SEO_ROUTE_START,
	DELETE_SEO_ROUTE_SUCCESS,
	GET_ALL_SEO_ROUTES_FAIL,
	GET_ALL_SEO_ROUTES_START,
	GET_ALL_SEO_ROUTES_SUCCESS,
	GET_SEO_ROUTE_FAIL,
	GET_SEO_ROUTE_START,
	GET_SEO_ROUTE_SUCCESS,
	UPDATE_SEO_ROUTE_FAIL,
	UPDATE_SEO_ROUTE_START,
	UPDATE_SEO_ROUTE_SUCCESS,
} from './actionTypes';

export const getAllSeoRoutesStart = (payload) => ({
	type: GET_ALL_SEO_ROUTES_START,
	payload,
});

export const getAllSeoRoutesSuccess = (payload) => ({
	type: GET_ALL_SEO_ROUTES_SUCCESS,
	payload,
});

export const getAllSeoRoutesFail = (payload) => ({
	type: GET_ALL_SEO_ROUTES_FAIL,
	payload,
});

export const getASeoRouteStart = (payload) => ({
	type: GET_SEO_ROUTE_START,
	payload,
});

export const getASeoRouteSuccess = (payload) => ({
	type: GET_SEO_ROUTE_SUCCESS,
	payload,
});

export const getASeoRouteFail = (payload) => ({
	type: GET_SEO_ROUTE_FAIL,
	payload,
});

export const createSeoRouteStart = (payload) => ({
	type: CREATE_SEO_ROUTE_START,
	payload,
});

export const createSeoRouteSuccess = (payload) => ({
	type: CREATE_SEO_ROUTE_SUCCESS,
	payload,
});

export const createSeoRouteFail = (payload) => ({
	type: CREATE_SEO_ROUTE_FAIL,
	payload,
});

export const updateSeoRouteStart = (payload) => ({
	type: UPDATE_SEO_ROUTE_START,
	payload,
});

export const updateSeoRouteSuccess = (payload) => ({
	type: UPDATE_SEO_ROUTE_SUCCESS,
	payload,
});

export const updateSeoRouteFail = (payload) => ({
	type: UPDATE_SEO_ROUTE_FAIL,
	payload,
});

export const deleteSeoRouteStart = (payload) => ({
	type: DELETE_SEO_ROUTE_START,
	payload,
});

export const deleteSeoRouteSuccess = (payload) => ({
	type: DELETE_SEO_ROUTE_SUCCESS,
	payload,
});

export const deleteSeoRouteFail = (payload) => ({
	type: DELETE_SEO_ROUTE_FAIL,
	payload,
});
