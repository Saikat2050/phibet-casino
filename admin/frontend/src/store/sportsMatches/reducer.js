/* eslint-disable no-case-declarations */
// import { current } from '@reduxjs/toolkit';
import {
	FETCH_SPORTS_MATCHES_FAIL,
	FETCH_SPORTS_MATCHES_START,
	FETCH_SPORTS_MATCHES_SUCCESS,
	RESET_SPORTS_MATCHES_DATA,
	UPDATE_SPORTS_FEATURED_MATCHES_FAIL,
	UPDATE_SPORTS_FEATURED_MATCHES_START,
	UPDATE_SPORTS_FEATURED_MATCHES_SUCCESS,
} from './actionTypes';

const initialState = {
	sportsMatches: null,
	error: '',
	loading: false,
	isFeaturedUpdateLoading: false,
	featuredFabData: null,
};

const sportsMatchesReducer = (state = initialState, { type, payload } = {}) => {
	switch (type) {
		case FETCH_SPORTS_MATCHES_START:
			return {
				...state,
				loading: true,
			};
		case FETCH_SPORTS_MATCHES_FAIL:
			return {
				...state,
				loading: false,
				error: true,
			};
		case FETCH_SPORTS_MATCHES_SUCCESS:
			return {
				...state,
				loading: false,
				sportsMatches: payload,
			};
		case RESET_SPORTS_MATCHES_DATA:
			return {
				...state,
				loading: false,
				sportsMatches: null,
				error: '',
			};
		case UPDATE_SPORTS_FEATURED_MATCHES_START:
			return {
				...state,
				isFeaturedUpdateLoading: true,
				featuredFabData: payload,
			};

		case UPDATE_SPORTS_FEATURED_MATCHES_FAIL:
			return {
				...state,
				isFeaturedUpdateLoading: false,
				error: true,
				featuredFabData: null,
			};
		case UPDATE_SPORTS_FEATURED_MATCHES_SUCCESS:
			// return {
			// 	...state,
			// 	isFeaturedUpdateLoading: false,
			// 	featuredFabData: null
			// };
			const temp = { ...state.sportsMatches };
			const newObject = temp?.events?.map((obj) =>
				obj.matchId === payload.matchId
					? { ...obj, isFeatured: payload.isFeatured }
					: obj
			);
			const newData = {
				...state.sportsMatches,
				events: newObject,
			};
			return {
				...state,
				isFeaturedUpdateLoading: false,
				sportsMatches: newData,
			};
		default:
			return { ...state };
	}
};

export default sportsMatchesReducer;
