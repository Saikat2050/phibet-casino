/* eslint-disable no-case-declarations */
import {
	GET_SPORTS_LIST,
	GET_SPORTS_LIST_SUCCESS,
	GET_SPORTS_LIST_FAIL,
	GET_SPORTS_COUNTRIES,
	GET_SPORTS_COUNTRIES_SUCCESS,
	GET_SPORTS_COUNTRIES_FAIL,
	GET_SPORTS_TOURNAMENT_LIST,
	GET_SPORTS_TOURNAMENT_LIST_SUCCESS,
	GET_SPORTS_TOURNAMENT_LIST_FAIL,
	UPDATE_STATUS_START,
	UPDATE_STATUS_SUCCESS,
	UPDATE_STATUS_FAIL,
	UPDATE_COMPANYODD_FAILURE,
	UPDATE_COMPANYODD_SUCCESS,
	UPDATE_COMPANYODD_START,
	DETACH_ODDSVARIATION_FAILURE,
	DETACH_ODDSVARIATION_SUCCESS,
	DETACH_ODDSVARIATION_START,
	UPDATE_ODDSVARIATION_FAILURE,
	UPDATE_ODDSVARIATION_SUCCESS,
	UPDATE_ODDSVARIATION_START,
	GET_SPORTS_MATCHESDETAIL_FAILURE,
	GET_SPORTS_MATCHESDETAIL_SUCCESS,
	GET_SPORTS_MATCHESDETAIL_START,
	UPLOAD_IMAGE_START,
	UPLOAD_IMAGE_SUCCESS,
	UPLOAD_IMAGE_FAILURE,
	RESET_SPORTS_LIST,
	RESET_SPORTS_COUNTRIES,
	RESET_SPORTS_TOURNAMENT_LIST,
	RESET_SPORTS_MATCHESDETAIL_DATA,
	UPLOAD_SPORTS_COUNTRY_IMAGE_START,
	UPLOAD_SPORTS_COUNTRY_IMAGE_SUCCESS,
	UPLOAD_SPORTS_COUNTRY_IMAGE_FAILURE,
} from './actionTypes';

const INIT_STATE = {
	sportsListInfo: null,
	sportsListError: null,
	isSportsListLoading: true,
	sportsCountries: null,
	sportsCountriesError: null,
	isSportsCountriesLoading: true,
	sportsTournamentList: null,
	sportsTournamentListError: null,
	isSportsTournamentListLoading: true,
	updateStatus: false,
	updateStatusError: null,
	isUpdateStatusLoading: false,
	isSportsMatchDetailsLoading: false,
	isUpdateOdsVariationLoading: false,
	isdeatechOdsVariationLoading: false,
	isUpdateCompanyOdsLoading: false,
	matchOdsDetails: null,
	isSportsMatchDetailsError: null,
	isUploadImageLoading: false,
	uploadImageError: null,
	uploadImageSuccess: false,
	isUploadSportsCountryImageLoading: false,
	uploadSportsCountryImageError: null,
	uploadSportsCountryImageSuccess: false,
};

const sportsList = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_SPORTS_LIST:
			return {
				...state,
				isSportsListLoading: false,
			};

		case GET_SPORTS_LIST_SUCCESS:
			return {
				...state,
				isSportsListLoading: true,
				sportsListInfo: payload,
				sportsListError: null,
			};

		case GET_SPORTS_LIST_FAIL:
			return {
				...state,
				sportsListError: payload,
				isSportsListLoading: true,
			};

		case RESET_SPORTS_LIST:
			return {
				...state,
				sportsListError: null,
				sportsListInfo: null,
				isSportsListLoading: true,
			};

		case GET_SPORTS_COUNTRIES:
			return {
				...state,
				isSportsCountriesLoading: false,
			};

		case GET_SPORTS_COUNTRIES_SUCCESS:
			return {
				...state,
				isSportsCountriesLoading: true,
				sportsCountries: payload,
				sportsCountriesError: null,
			};

		case GET_SPORTS_COUNTRIES_FAIL:
			return {
				...state,
				sportsCountriesError: payload,
				isSportsCountriesLoading: true,
			};

		case RESET_SPORTS_COUNTRIES:
			return {
				...state,
				isSportsCountriesLoading: true,
				sportsCountries: null,
				sportsCountriesError: null,
			};

		case GET_SPORTS_TOURNAMENT_LIST:
			return {
				...state,
				isSportsTournamentListLoading: false,
			};

		case GET_SPORTS_TOURNAMENT_LIST_SUCCESS:
			return {
				...state,
				isSportsTournamentListLoading: true,
				sportsTournamentList: payload,
				sportsTournamentListError: null,
			};

		case GET_SPORTS_TOURNAMENT_LIST_FAIL:
			return {
				...state,
				sportsTournamentListError: payload,
				SportsTournamentListLoading: true,
			};

		case RESET_SPORTS_TOURNAMENT_LIST:
			return {
				...state,
				isSportsTournamentListLoading: true,
				sportsTournamentList: null,
				sportsTournamentListError: null,
			};

		case UPDATE_STATUS_START:
			return {
				...state,
				isUpdateStatusLoading: true,
			};

		case UPDATE_STATUS_SUCCESS:
			const data = {
				...state,
				isUpdateStatusLoading: false,
				updateStatus: true,
			};
			if (payload.code === 'SPORTS') {
				const temp = { ...state.sportsListInfo };
				const newObject = temp?.sportsList?.sports?.map((obj) =>
					obj.sportId === payload.sportId
						? { ...obj, isActive: !!payload.status }
						: obj
				);
				const newData = {
					...state.sportsListInfo,
					sportsList: {
						...state.sportsListInfo.sportsList,
						sports: newObject,
					},
				};
				data.sportsListInfo = newData;
			} else if (payload.code === 'SPORTCONTRY') {
				const temp = { ...state.sportsCountries };
				const newObject = temp?.countryList?.locations?.map((obj) =>
					obj.countryId === payload.sportCountryId
						? { ...obj, isActive: !!payload.status }
						: obj
				);
				const newData = {
					...state.sportsCountries,
					countryList: {
						...state.sportsCountries.countryList,
						locations: newObject,
					},
				};
				data.sportsCountries = newData;
			}
			return {
				...state,
				...data,
			};

		case UPDATE_STATUS_FAIL:
			return {
				...state,
				updateStatusError: payload,
				isUpdateStatusLoading: false,
				updateStatus: false,
			};

		case UPDATE_COMPANYODD_FAILURE:
			return {
				...state,
				isUpdateCompanyOdsLoading: false,
			};

		case UPDATE_COMPANYODD_SUCCESS:
			return {
				...state,
				isUpdateCompanyOdsLoading: false,
			};

		case UPDATE_COMPANYODD_START:
			return {
				...state,
				isUpdateCompanyOdsLoading: true,
			};

		case DETACH_ODDSVARIATION_FAILURE:
			return {
				...state,
				isdeatechOdsVariationLoading: false,
			};

		case DETACH_ODDSVARIATION_SUCCESS:
			return {
				...state,
				isdeatechOdsVariationLoading: false,
			};

		case DETACH_ODDSVARIATION_START:
			return {
				...state,
				isdeatechOdsVariationLoading: true,
			};

		case UPDATE_ODDSVARIATION_FAILURE:
			return {
				...state,
				isUpdateOdsVariationLoading: false,
			};

		case UPDATE_ODDSVARIATION_SUCCESS:
			return {
				...state,
				isUpdateOdsVariationLoading: false,
			};

		case UPDATE_ODDSVARIATION_START:
			return {
				...state,
				isUpdateOdsVariationLoading: true,
			};

		case GET_SPORTS_MATCHESDETAIL_FAILURE:
			return {
				...state,
				isSportsMatchDetailsLoading: false,
				isSportsMatchDetailsError: payload,
			};

		case GET_SPORTS_MATCHESDETAIL_SUCCESS:
			return {
				...state,
				isSportsMatchDetailsLoading: false,
				matchOdsDetails: payload,
			};

		case GET_SPORTS_MATCHESDETAIL_START:
			return {
				...state,
				isSportsMatchDetailsLoading: true,
			};

		case RESET_SPORTS_MATCHESDETAIL_DATA:
			return {
				...state,
				isSportsMatchDetailsLoading: false,
				matchOdsDetails: null,
				isSportsMatchDetailsError: null,
			};

		case UPLOAD_IMAGE_START:
			return {
				...state,
				isUploadImageLoading: true,
				uploadImageSuccess: false,
				updateStatusError: null,
			};

		case UPLOAD_IMAGE_SUCCESS:
			return {
				...state,
				isUploadImageLoading: false,
				uploadImageSuccess: true,
				updateStatusError: null,
			};

		case UPLOAD_IMAGE_FAILURE:
			return {
				...state,
				isUploadImageLoading: false,
				uploadImageError: payload,
				updateStatusError: null,
			};

		case UPLOAD_SPORTS_COUNTRY_IMAGE_START:
			return {
				...state,
				isUploadSportsCountryImageLoading: true,
				uploadSportsCountryImageSuccess: false,
				uploadSportsCountryImageError: null,
			};

		case UPLOAD_SPORTS_COUNTRY_IMAGE_SUCCESS:
			return {
				...state,
				isUploadSportsCountryImageLoading: false,
				uploadSportsCountryImageSuccess: payload,
				uploadSportsCountryImageError: null,
			};

		case UPLOAD_SPORTS_COUNTRY_IMAGE_FAILURE:
			return {
				...state,
				isUploadSportsCountryImageLoading: false,
				uploadSportsCountryImageSuccess: false,
				uploadSportsCountryImageError: payload,
			};

		default:
			return { ...state };
	}
};

export default sportsList;
