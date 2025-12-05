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

export const getSportsListSuccess = (payload) => ({
	type: GET_SPORTS_LIST_SUCCESS,
	payload,
});

export const getSportsListFail = (payload) => ({
	type: GET_SPORTS_LIST_FAIL,
	payload,
});

export const getSportsList = (payload) => ({
	type: GET_SPORTS_LIST,
	payload,
});

export const resetSportsList = (payload) => ({
	type: RESET_SPORTS_LIST,
	payload,
});

export const getSportsCountriesSuccess = (payload) => ({
	type: GET_SPORTS_COUNTRIES_SUCCESS,
	payload,
});

export const getSportsCountriesFail = (payload) => ({
	type: GET_SPORTS_COUNTRIES_FAIL,
	payload,
});

export const getSportsCountries = (payload) => ({
	type: GET_SPORTS_COUNTRIES,
	payload,
});

export const resetSportsCountries = (payload) => ({
	type: RESET_SPORTS_COUNTRIES,
	payload,
});

export const getSportsTournamentListSuccess = (payload) => ({
	type: GET_SPORTS_TOURNAMENT_LIST_SUCCESS,
	payload,
});

export const getSportsTournamentListFail = (payload) => ({
	type: GET_SPORTS_TOURNAMENT_LIST_FAIL,
	payload,
});

export const getSportsTournamentList = (payload) => ({
	type: GET_SPORTS_TOURNAMENT_LIST,
	payload,
});

export const resetSportsTournamentList = (payload) => ({
	type: RESET_SPORTS_TOURNAMENT_LIST,
	payload,
});

export const updateStatusStart = (payload) => ({
	type: UPDATE_STATUS_START,
	payload,
});

export const updateStatusSuccess = (payload) => ({
	type: UPDATE_STATUS_SUCCESS,
	payload,
});

export const updateStatusFail = (payload) => ({
	type: UPDATE_STATUS_FAIL,
	payload,
});

export const getSportsMatchDetailStart = (payload) => ({
	type: GET_SPORTS_MATCHESDETAIL_START,
	payload,
});

export const getSportsMatchDetailSuccess = (payload) => ({
	type: GET_SPORTS_MATCHESDETAIL_SUCCESS,
	payload,
});

export const getSportsMatchDetailFail = (payload) => ({
	type: GET_SPORTS_MATCHESDETAIL_FAILURE,
	payload,
});

export const resetSportsMatchDetailData = (payload) => ({
	type: RESET_SPORTS_MATCHESDETAIL_DATA,
	payload,
});

export const updateOdsVariationStart = (payload) => ({
	type: UPDATE_ODDSVARIATION_START,
	payload,
});
export const updateOdsVariationSuccess = (payload) => ({
	type: UPDATE_ODDSVARIATION_SUCCESS,
	payload,
});
export const updateOdsVariationFail = (payload) => ({
	type: UPDATE_ODDSVARIATION_FAILURE,
	payload,
});
export const deatechOdsVariationStart = (payload) => ({
	type: DETACH_ODDSVARIATION_START,
	payload,
});
export const deatechOdsVariationSuccess = (payload) => ({
	type: DETACH_ODDSVARIATION_SUCCESS,
	payload,
});
export const deatechOdsVariationFail = (payload) => ({
	type: DETACH_ODDSVARIATION_FAILURE,
	payload,
});
export const updateCompanyOddStart = (payload) => ({
	type: UPDATE_COMPANYODD_START,
	payload,
});
export const updateCompanyOddSuccess = (payload) => ({
	type: UPDATE_COMPANYODD_SUCCESS,
	payload,
});
export const updateCompanyOddFail = (payload) => ({
	type: UPDATE_COMPANYODD_FAILURE,
	payload,
});

export const uploadImageStart = (payload) => ({
	type: UPLOAD_IMAGE_START,
	payload,
});

export const uploadImageSuccess = (payload) => ({
	type: UPLOAD_IMAGE_SUCCESS,
	payload,
});

export const uploadImageFail = (payload) => ({
	type: UPLOAD_IMAGE_FAILURE,
	payload,
});

export const uploadSportsCountryImageStart = (payload) => ({
	type: UPLOAD_SPORTS_COUNTRY_IMAGE_START,
	payload,
});

export const uploadSportsCountryImageSuccess = (payload) => ({
	type: UPLOAD_SPORTS_COUNTRY_IMAGE_SUCCESS,
	payload,
});

export const uploadSportsCountryImageFail = (payload) => ({
	type: UPLOAD_SPORTS_COUNTRY_IMAGE_FAILURE,
	payload,
});
