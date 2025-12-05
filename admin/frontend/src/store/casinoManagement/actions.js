import {
	GET_CASINO_PROVIDERS_DATA,
	GET_CASINO_PROVIDERS_DATA_SUCCESS,
	GET_CASINO_PROVIDERS_DATA_FAIL,
	GET_CASINO_CATEGORY_DATA,
	GET_CASINO_CATEGORY_DATA_SUCCESS,
	GET_CASINO_CATEGORY_DATA_FAIL,
	GET_CASINO_GAMES,
	GET_CASINO_GAMES_SUCCESS,
	GET_CASINO_GAMES_FAIL,
	GET_LANGUAGE_DATA_SUCCESS,
	GET_LANGUAGE_DATA_FAIL,
	GET_LANGUAGE_DATA_START,
	CREATE_CASINO_PROVIDERS,
	CREATE_CASINO_PROVIDERS_FAIL,
	CREATE_CASINO_PROVIDERS_SUCCESS,
	CREATE_CASINO_CATEGORY_SUCCESS,
	CREATE_CASINO_CATEGORY_FAIL,
	CREATE_CASINO_CATEGORY_START,
	UPDATE_CASINO_STATUS_START,
	UPDATE_CASINO_STATUS_SUCCESS,
	UPDATE_CASINO_STATUS_FAIL,
	EDIT_CASINO_CATEGORY_SUCCESS,
	EDIT_CASINO_CATEGORY_FAIL,
	EDIT_CASINO_CATEGORY,
	EDIT_CASINO_PROVIDERS_SUCCESS,
	EDIT_CASINO_PROVIDERS_FAIL,
	EDIT_CASINO_PROVIDERS,
	EDIT_CASINO_GAMES_SUCCESS,
	EDIT_CASINO_GAMES_FAIL,
	EDIT_CASINO_GAMES_START,
	UPDATE_GAME_ISFEATURED_START,
	UPDATE_GAME_ISFEATURED_SUCCESS,
	UPDATE_GAME_ISFEATURED_FAIL,
	ADD_GAME_TO_CASINO_CATEGORY_START,
	ADD_GAME_TO_CASINO_CATEGORY_SUCCESS,
	ADD_GAME_TO_CASINO_CATEGORY_FAIL,
	DELETE_CASINO_CATEGORY_START,
	DELETE_CASINO_CATEGORY_SUCCESS,
	DELETE_CASINO_CATEGORY_FAIL,
	REORDER_CASINO_CATEGORY_START,
	REORDER_CASINO_CATEGORY_SUCCESS,
	REORDER_CASINO_CATEGORY_FAIL,
	REORDER_CASINO_GAMES_START,
	REORDER_CASINO_GAMES_SUCCESS,
	REORDER_CASINO_GAMES_FAIL,
	RESET_CASINO_STATE,
	RESET_CASINO_PROVIDERS_DATA,
	RESET_CASINO_GAMES,
	GET_ADDED_GAMES_IN_CATEGORY_START,
	GET_ADDED_GAMES_IN_CATEGORY_SUCCESS,
	GET_ADDED_GAMES_IN_CATEGORY_FAIL,
	REMOVE_GAME_FROM_CATEGORY_START,
	REMOVE_GAME_FROM_CATEGORY_SUCCESS,
	REMOVE_GAME_FROM_CATEGORY_FAIL,
	ADD_GAMES_START,
	ADD_GAMES_SUCCESS,
	ADD_GAMES_FAIL,
	REORDER_CASINO_PROVIDER_FAIL,
	REORDER_CASINO_PROVIDER_SUCCESS,
	REORDER_CASINO_PROVIDER_START,
	UPDATE_LANDING_PAGE_GAME_START,
	UPDATE_LANDING_PAGE_GAME_SUCCESS,
} from './actionTypes';

export const getCasinoProvidersDataSuccess = (payload) => ({
	type: GET_CASINO_PROVIDERS_DATA_SUCCESS,
	payload,
});

export const getCasinoProvidersDataFailure = (payload) => ({
	type: GET_CASINO_PROVIDERS_DATA_FAIL,
	payload,
});

export const getCasinoProvidersDataStart = (payload) => ({
	type: GET_CASINO_PROVIDERS_DATA,
	payload,
});

export const resetCasinoProvidersData = (payload) => ({
	type: RESET_CASINO_PROVIDERS_DATA,
	payload,
});

export const getCasinoCategoryDetailSuccess = (payload) => ({
	type: GET_CASINO_CATEGORY_DATA_SUCCESS,
	payload,
});

export const getCasinoCategoryDetailFailure = (payload) => ({
	type: GET_CASINO_CATEGORY_DATA_FAIL,
	payload,
});

export const getCasinoCategoryDetailStart = (payload) => ({
	type: GET_CASINO_CATEGORY_DATA,
	payload,
});

export const getCasinoGamesSuccess = (payload) => ({
	type: GET_CASINO_GAMES_SUCCESS,
	payload,
});

export const getCasinoGamesFailure = (payload) => ({
	type: GET_CASINO_GAMES_FAIL,
	payload,
});

export const getCasinoGamesStart = (payload) => ({
	type: GET_CASINO_GAMES,
	payload,
});

export const resetCasinoGamesData = (payload) => ({
	type: RESET_CASINO_GAMES,
	payload,
});

export const getLanguagesSuccess = (payload) => ({
	type: GET_LANGUAGE_DATA_SUCCESS,
	payload,
});

export const getLanguagesFailure = (payload) => ({
	type: GET_LANGUAGE_DATA_FAIL,
	payload,
});

export const getLanguagesStart = (payload) => ({
	type: GET_LANGUAGE_DATA_START,
	payload,
});

export const createCasinoProvidersSuccess = (payload) => ({
	type: CREATE_CASINO_PROVIDERS_SUCCESS,
	payload,
});

export const createCasinoProvidersFailure = (payload) => ({
	type: CREATE_CASINO_PROVIDERS_FAIL,
	payload,
});

export const createCasinoProvidersStart = (payload) => ({
	type: CREATE_CASINO_PROVIDERS,
	payload,
});

export const createCasinoCategorySuccess = (payload) => ({
	type: CREATE_CASINO_CATEGORY_SUCCESS,
	payload,
});

export const createCasinoCategoryFailure = (payload) => ({
	type: CREATE_CASINO_CATEGORY_FAIL,
	payload,
});

export const createCasinoCategoryStart = (payload) => ({
	type: CREATE_CASINO_CATEGORY_START,
	payload,
});

export const editCasinoCategorySuccess = (payload) => ({
	type: EDIT_CASINO_CATEGORY_SUCCESS,
	payload,
});

export const editCasinoCategoryFailure = (payload) => ({
	type: EDIT_CASINO_CATEGORY_FAIL,
	payload,
});

export const editCasinoCategoryStart = (payload) => ({
	type: EDIT_CASINO_CATEGORY,
	payload,
});

export const updateCasinoStatusSuccess = (payload) => ({
	type: UPDATE_CASINO_STATUS_SUCCESS,
	payload,
});

export const updateCasinoStatusFail = (payload) => ({
	type: UPDATE_CASINO_STATUS_FAIL,
	payload,
});

export const updateCasinoStatusStart = (payload) => ({
	type: UPDATE_CASINO_STATUS_START,
	payload,
});

export const editCasinoProvidersSuccess = (payload) => ({
	type: EDIT_CASINO_PROVIDERS_SUCCESS,
	payload,
});

export const editCasinoProvidersFailure = (payload) => ({
	type: EDIT_CASINO_PROVIDERS_FAIL,
	payload,
});

export const editCasinoProvidersStart = (payload) => ({
	type: EDIT_CASINO_PROVIDERS,
	payload,
});

export const editCasinoGamesSuccess = (payload) => ({
	type: EDIT_CASINO_GAMES_SUCCESS,
	payload,
});

export const editCasinoGamesFailure = (payload) => ({
	type: EDIT_CASINO_GAMES_FAIL,
	payload,
});

export const editCasinoGamesStart = (payload) => ({
	type: EDIT_CASINO_GAMES_START,
	payload,
});

export const updateCasinoIsFeaturedStart = (payload) => ({
	type: UPDATE_GAME_ISFEATURED_START,
	payload,
});
export const updateCasinoLandingPageStart = (payload) => ({
	type: UPDATE_LANDING_PAGE_GAME_START,
	payload,
});
export const updateCasinoIsFeaturedSuccess = (payload) => ({
	type: UPDATE_GAME_ISFEATURED_SUCCESS,
	payload,
});
export const updateCasinoLandingPageSuccess = (payload) => ({
	type: UPDATE_LANDING_PAGE_GAME_SUCCESS,
	payload,
});
export const updateCasinoIsFeaturedFailure = (payload) => ({
	type: UPDATE_GAME_ISFEATURED_FAIL,
	payload,
});
export const updateCasinoLandingPageFailure = (payload) => ({
	type: UPDATE_GAME_ISFEATURED_FAIL,
	payload,
});

export const addGameToCategoryStart = (payload) => ({
	type: ADD_GAME_TO_CASINO_CATEGORY_START,
	payload,
});
export const addGameToCategorySuccess = (payload) => ({
	type: ADD_GAME_TO_CASINO_CATEGORY_SUCCESS,
	payload,
});

export const addGameToCategoryFail = (payload) => ({
	type: ADD_GAME_TO_CASINO_CATEGORY_FAIL,
	payload,
});

export const addGameStart = (payload) => ({
	type: ADD_GAMES_START,
	payload,
});

export const addGameSuccess = (payload) => ({
	type: ADD_GAMES_SUCCESS,
	payload,
});

export const addGameFail = (payload) => ({
	type: ADD_GAMES_FAIL,
	payload,
});

export const deleteCasinoCategoryStart = (payload) => ({
	type: DELETE_CASINO_CATEGORY_START,
	payload,
});

export const deleteCasinoCategorySuccess = (payload) => ({
	type: DELETE_CASINO_CATEGORY_SUCCESS,
	payload,
});

export const deleteCasinoCategoryFail = (payload) => ({
	type: DELETE_CASINO_CATEGORY_FAIL,
	payload,
});

export const reorderCasinoCategoryStart = (payload) => ({
	type: REORDER_CASINO_CATEGORY_START,
	payload,
});

export const reorderCasinoCategorySuccess = (payload) => ({
	type: REORDER_CASINO_CATEGORY_SUCCESS,
	payload,
});

export const reorderCasinoCategoryFail = (payload) => ({
	type: REORDER_CASINO_CATEGORY_FAIL,
	payload,
});

export const reorderCasinoGamesStart = (payload) => ({
	type: REORDER_CASINO_GAMES_START,
	payload,
});

export const reorderCasinoProviderStart = (payload) => ({
	type: REORDER_CASINO_PROVIDER_START,
	payload,
});

export const reorderCasinoProviderSuccess = (payload) => ({
	type: REORDER_CASINO_PROVIDER_SUCCESS,
	payload,
});

export const reorderCasinoProviderFail = (payload) => ({
	type: REORDER_CASINO_PROVIDER_FAIL,
	payload,
});

export const reorderCasinoGamesSuccess = (payload) => ({
	type: REORDER_CASINO_GAMES_SUCCESS,
	payload,
});

export const reorderCasinoGamesFail = (payload) => ({
	type: REORDER_CASINO_GAMES_FAIL,
	payload,
});

export const resetCasinoState = () => ({
	type: RESET_CASINO_STATE,
});

export const getAddedGameInCategoryStart = (payload) => ({
	type: GET_ADDED_GAMES_IN_CATEGORY_START,
	payload,
});

export const getAddedGamesInCategorySuccess = (payload) => ({
	type: GET_ADDED_GAMES_IN_CATEGORY_SUCCESS,
	payload,
});

export const getAddedGamesInCategoryFail = (payload) => ({
	type: GET_ADDED_GAMES_IN_CATEGORY_FAIL,
	payload,
});

export const removeGameFromCategoryStart = (payload) => ({
	type: REMOVE_GAME_FROM_CATEGORY_START,
	payload,
});

export const removeGameFromCategorySuccess = (payload) => ({
	type: REMOVE_GAME_FROM_CATEGORY_SUCCESS,
	payload,
});

export const removeGameFromCategoryFail = (payload) => ({
	type: REMOVE_GAME_FROM_CATEGORY_FAIL,
	payload,
});
