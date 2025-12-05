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

const initialState = {
	seoRoutes: null,
	seoRoutesLoading: false,
	seoRoutesError: null,

	seoRouteDetails: null,
	seoRouteDetailsLoading: false,
	seoRouteDetailsError: null,

	createRouteInprogress: false,
	createRouteSuccess: false,
	createRouteError: null,

	updateRouteInprogress: false,
	updateRouteSuccess: false,
	updateRouteError: null,

	deleteRouteInprogress: false,
	deleteRouteSuccess: false,
	deleteRouteError: null,
};

const SeoData = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case GET_ALL_SEO_ROUTES_START:
			return {
				...state,
				seoRoutesLoading: true,
			};
		case GET_ALL_SEO_ROUTES_SUCCESS:
			return {
				...state,
				seoRoutesLoading: false,
				seoRoutesError: null,
				seoRoutes: payload,
			};
		case GET_ALL_SEO_ROUTES_FAIL:
			return {
				...state,
				seoRoutesLoading: false,
				seoRoutes: null,
				seoRoutesError: payload,
			};

		case GET_SEO_ROUTE_START:
			return {
				...state,
				seoRouteDetails: null,
				seoRouteDetailsLoading: true,
				seoRouteDetailsError: null,
			};
		case GET_SEO_ROUTE_SUCCESS:
			return {
				...state,
				seoRouteDetails: payload,
				seoRouteDetailsLoading: false,
				seoRouteDetailsError: null,
			};
		case GET_SEO_ROUTE_FAIL:
			return {
				...state,
				seoRouteDetails: null,
				seoRouteDetailsLoading: false,
				seoRouteDetailsError: payload,
			};

		case CREATE_SEO_ROUTE_START:
			return {
				...state,
				createRouteInprogress: true,
				createRouteSuccess: false,
				createRouteError: null,
			};
		case CREATE_SEO_ROUTE_SUCCESS:
			return {
				...state,
				createRouteInprogress: false,
				createRouteSuccess: true,
				createRouteError: null,
			};
		case CREATE_SEO_ROUTE_FAIL:
			return {
				...state,
				createRouteInprogress: false,
				createRouteSuccess: false,
				createRouteError: payload,
			};

		case UPDATE_SEO_ROUTE_START:
			return {
				...state,
				updateRouteInprogress: true,
				updateRouteError: null,
				updateRouteSuccess: false,
			};
		case UPDATE_SEO_ROUTE_SUCCESS:
			return {
				...state,
				updateRouteInprogress: false,
				updateRouteError: null,
				updateRouteSuccess: true,
			};
		case UPDATE_SEO_ROUTE_FAIL:
			return {
				...state,
				updateRouteInprogress: false,
				updateRouteError: payload,
				updateRouteSuccess: false,
			};

		case DELETE_SEO_ROUTE_START:
			return {
				...state,
				deleteRouteInprogress: true,
				deleteRouteError: null,
				deleteRouteSuccess: false,
			};
		case DELETE_SEO_ROUTE_SUCCESS:
			return {
				...state,
				deleteRouteInprogress: false,
				deleteRouteError: null,
				deleteRouteSuccess: true,
			};
		case DELETE_SEO_ROUTE_FAIL:
			return {
				...state,
				deleteRouteInprogress: false,
				deleteRouteError: payload,
				deleteRouteSuccess: false,
			};

		default:
			return { ...state };
	}
};

export default SeoData;
