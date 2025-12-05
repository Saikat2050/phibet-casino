/* eslint-disable no-case-declarations */
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
	GET_LANGUAGE_DATA_START,
	GET_LANGUAGE_DATA_FAIL,
	GET_LANGUAGE_DATA_SUCCESS,
	CREATE_CASINO_PROVIDERS,
	CREATE_CASINO_PROVIDERS_SUCCESS,
	CREATE_CASINO_PROVIDERS_FAIL,
	CREATE_CASINO_CATEGORY_START,
	CREATE_CASINO_CATEGORY_SUCCESS,
	CREATE_CASINO_CATEGORY_FAIL,
	UPDATE_CASINO_STATUS_START,
	UPDATE_CASINO_STATUS_SUCCESS,
	UPDATE_CASINO_STATUS_FAIL,
	EDIT_CASINO_CATEGORY,
	EDIT_CASINO_CATEGORY_SUCCESS,
	EDIT_CASINO_CATEGORY_FAIL,
	EDIT_CASINO_PROVIDERS,
	EDIT_CASINO_PROVIDERS_SUCCESS,
	EDIT_CASINO_PROVIDERS_FAIL,
	EDIT_CASINO_GAMES_START,
	EDIT_CASINO_GAMES_SUCCESS,
	EDIT_CASINO_GAMES_FAIL,
	UPDATE_GAME_ISFEATURED_START,
	UPDATE_LANDING_PAGE_GAME_START,
	UPDATE_LANDING_PAGE_GAME_SUCCESS,
	UPDATE_LANDING_PAGE_GAME_FAIL,
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
} from './actionTypes';

const INIT_STATE = {
	casinoProvidersData: null,
	casinoProvidersDataError: null,
	isCasinoProvidersDataLoading: true,
	casinoCategoryDetails: null,
	casinoCategoryDetailsError: null,
	iscasinoCategoryDetailsLoading: true,
	casinoGames: null,
	casinoGamesError: null,
	isCasinoGamesLoading: false,
	languageDataLoading: true,
	languageData: null,
	languageDataError: null,
	isCreateProviderError: false,
	isCreateProviderSuccess: false,
	isCreateProviderLoading: false,
	isEditProviderSuccess: false,
	isEditProviderLoading: false,
	isEditProviderError: false,
	isCreateCategoryError: false,
	isCreateCategorySuccess: false,
	isCreateCategoryLoading: false,
	isEditCategoryError: false,
	isEditCategorySuccess: false,
	isEditCategoryLoading: false,
	isUpdateCasinoStatus: false,
	isUpdateCasinoStatusError: null,
	isUpdateCasinoStatusLoading: false,
	isEditCasinoGamesError: false,
	isEditCasinoGamesSuccess: false,
	isEditCasinoGamesLoading: false,
	isFeaturedLoading: false,
	featuredGameData: null,
	isAddGameToCasinoCatSuccess: false,
	isAddGameToCasinoCatError: null,
	isAddGameToCasinoCatLoading: false,
	isDeleteCasinoCategorySuccess: false,
	isDeleteCasinoCategoryError: null,
	isDeleteCasinoCategoryLoading: false,
	isReorderCasinoCategorySuccess: false,
	isReorderCasinoCategoryError: null,
	isReorderCasinoCategoryLoading: false,
	isReorderCasinoGamesSuccess: false,
	isReorderCasinoGamesError: null,
	isReorderCasinoGamesLoading: false,
	categoryAddedGames: null,
	categoryAddedGamesError: null,
	isCategoryAddedGamesLoading: false,
	isRemoveGameFromCategoryLoading: false,
	isRemoveGameFromCategorySuccess: false,
	isRemoveGameFromCategoryError: null,
	isAddGameLoading: false,
	isAddGameError: null,
};

const CasinoManagementData = (state = INIT_STATE, { type, payload } = {}) => {
	switch (type) {
		case GET_CASINO_PROVIDERS_DATA:
			return {
				...state,
				isCasinoProvidersDataLoading: false,
			};

		case GET_CASINO_PROVIDERS_DATA_SUCCESS:
			return {
				...state,
				isCasinoProvidersDataLoading: true,
				casinoProvidersData: payload,
				casinoProvidersDataError: null,
			};

		case GET_CASINO_PROVIDERS_DATA_FAIL:
			return {
				...state,
				casinoProvidersDataError: payload,
				isCasinoProvidersDataLoading: true,
			};

		case RESET_CASINO_PROVIDERS_DATA:
			return {
				...state,
				casinoProvidersData: null,
				casinoProvidersDataError: null,
				isCasinoProvidersDataLoading: true,
			};

		case GET_CASINO_CATEGORY_DATA:
			return {
				...state,
				iscasinoCategoryDetailsLoading: false,
			};

		case GET_CASINO_CATEGORY_DATA_SUCCESS:
			return {
				...state,
				iscasinoCategoryDetailsLoading: true,
				casinoCategoryDetails: payload,
				casinoCategoryDetailsError: null,
			};

		case GET_CASINO_CATEGORY_DATA_FAIL:
			return {
				...state,
				casinoCategoryDetailsError: payload,
				iscasinoCategoryDetailsLoading: true,
			};

		case GET_CASINO_GAMES:
			return {
				...state,
				isCasinoGamesLoading: true,
			};

		case GET_CASINO_GAMES_SUCCESS:
			return {
				...state,
				isCasinoGamesLoading: false,
				casinoGames: payload,
				casinoGamesError: null,
			};

		case GET_CASINO_GAMES_FAIL:
			return {
				...state,
				casinoGamesError: payload,
				isCasinoGamesLoading: false,
			};

		case RESET_CASINO_GAMES:
			return {
				...state,
				casinoGames: null,
				casinoGamesError: null,
				isCasinoGamesLoading: false,
			};

		case GET_LANGUAGE_DATA_START:
			return {
				...state,
				languageDataLoading: false,
			};

		case GET_LANGUAGE_DATA_SUCCESS:
			return {
				...state,
				languageDataLoading: true,
				languageData: payload,
				languageDataError: null,
			};

		case GET_LANGUAGE_DATA_FAIL:
			return {
				...state,
				languageDataError: payload,
				languageDataLoading: true,
			};

		case CREATE_CASINO_PROVIDERS:
			return {
				...state,
				isCreateProviderLoading: true,
				isCreateProviderSuccess: false,
			};

		case CREATE_CASINO_PROVIDERS_SUCCESS:
			return {
				...state,
				isCreateProviderLoading: false,
				isCreateProviderSuccess: true,
			};

		case CREATE_CASINO_PROVIDERS_FAIL:
			return {
				...state,
				isCreateProviderError: payload,
				isCreateProviderLoading: false,
				isCreateProviderSuccess: false,
			};

		case EDIT_CASINO_PROVIDERS:
			return {
				...state,
				isEditProviderLoading: true,
				isEditProviderSuccess: false,
			};

		case EDIT_CASINO_PROVIDERS_SUCCESS:
			return {
				...state,
				isEditProviderLoading: false,
				isEditProviderSuccess: true,
			};

		case EDIT_CASINO_PROVIDERS_FAIL:
			return {
				...state,
				isEditProviderError: payload,
				isEditProviderLoading: false,
				isEditProviderSuccess: false,
			};

		case CREATE_CASINO_CATEGORY_START:
			return {
				...state,
				isCreateCategoryLoading: true,
				isCreateCategorySuccess: false,
			};

		case CREATE_CASINO_CATEGORY_SUCCESS:
			return {
				...state,
				isCreateCategoryLoading: false,
				isCreateCategorySuccess: true,
			};

		case CREATE_CASINO_CATEGORY_FAIL:
			return {
				...state,
				isCreateCategoryError: payload,
				isCreateCategoryLoading: false,
				isCreateCategorySuccess: false,
			};

		case EDIT_CASINO_CATEGORY:
			return {
				...state,
				isEditCategoryLoading: true,
				isEditCategorySuccess: false,
			};

		case EDIT_CASINO_CATEGORY_SUCCESS:
			return {
				...state,
				isEditCategoryLoading: false,
				isEditCategorySuccess: true,
			};

		case EDIT_CASINO_CATEGORY_FAIL:
			return {
				...state,
				isEditCategoryError: payload,
				isEditCategoryLoading: false,
				isEditCategorySuccess: false,
			};

		case EDIT_CASINO_GAMES_START:
			return {
				...state,
				isEditCasinoGamesLoading: true,
				isEditCasinoGamesSuccess: false,
			};

		case EDIT_CASINO_GAMES_SUCCESS:
			return {
				...state,
				isEditCasinoGamesLoading: false,
				isEditCasinoGamesSuccess: true,
			};

		case EDIT_CASINO_GAMES_FAIL:
			return {
				...state,
				isEditCasinoGamesError: payload,
				isEditCasinoGamesLoading: false,
				isEditCasinoGamesSuccess: false,
			};

		case UPDATE_CASINO_STATUS_START:
			return {
				...state,
				isUpdateCasinoStatusLoading: false,
			};

		case UPDATE_CASINO_STATUS_SUCCESS:
			return {
				...state,
				isUpdateCasinoStatusLoading: true,
				isUpdateCasinoStatus: true,
				isUpdateCasinoStatusError: null,
			};

		case UPDATE_CASINO_STATUS_FAIL:
			return {
				...state,
				isUpdateCasinoStatusLoading: false,
				isUpdateCasinoStatusError: payload,
				isUpdateCasinoStatus: false,
			};

		case UPDATE_GAME_ISFEATURED_START:
			return {
				...state,
				isFeaturedLoading: true,
				featuredGameData: payload,
			};

		case UPDATE_GAME_ISFEATURED_FAIL:
			return {
				...state,
				isFeaturedLoading: false,
				error: true,
				featuredGameData: null,
			};
		case UPDATE_GAME_ISFEATURED_SUCCESS:
			const temp = { ...state.casinoGames };
			const newObject = temp?.games?.map((game) =>
				game.id === payload.gameId
					? { ...game, isFeatured: !game.isFeatured }
					: game
			);
			const newData = {
				...state.casinoGames,
				games: newObject,
			};
			return {
				...state,
				isFeaturedLoading: false,
				casinoGames: newData,
				featuredGameData: null,
			};

		case UPDATE_LANDING_PAGE_GAME_START:
			return {
				...state,
				landingPageLoading: true,
				landingGameData: payload,
			};

		case UPDATE_LANDING_PAGE_GAME_FAIL:
			return {
				...state,
				landingPageLoading: false,
				error: true,
				landingGameData: null,
			};

		case UPDATE_LANDING_PAGE_GAME_SUCCESS:
			const tempLanding = { ...state.casinoGames };
			const newObjectLanding = tempLanding?.games?.map((game) =>
				game.id === payload.gameId
					? { ...game, landingPage: !game.landingPage }
					: game
			);
			const newDataLanding = {
				...state.casinoGames,
				games: newObjectLanding,
			};
			return {
				...state,
				landingPageLoading: false,
				casinoGames: newDataLanding,
				landingGameData: null,
			};
		case ADD_GAME_TO_CASINO_CATEGORY_START:
			return {
				...state,
				isAddGameToCasinoCatLoading: true,
			};

		case ADD_GAME_TO_CASINO_CATEGORY_SUCCESS:
			return {
				...state,
				isAddGameToCasinoCatLoading: false,
				isAddGameToCasinoCatSuccess: true,
				isAddGameToCasinoCatError: null,
			};

		case ADD_GAME_TO_CASINO_CATEGORY_FAIL:
			return {
				...state,
				isAddGameToCasinoCatLoading: false,
				isAddGameToCasinoCatSuccess: false,
				isAddGameToCasinoCatError: payload,
			};
		case ADD_GAMES_START:
			return {
				...state,
				isAddGameLoading: true,
			};
		case ADD_GAMES_SUCCESS:
			return {
				...state,
				isAddGameLoading: false,
				isAddGameError: null,
			};

		case ADD_GAMES_FAIL:
			return {
				...state,
				isAddGameLoading: false,
				isAddGameError: payload,
			};
		case DELETE_CASINO_CATEGORY_START:
			return {
				...state,
				isDeleteCasinoCategoryLoading: true,
				isDeleteCasinoCategorySuccess: false,
				isDeleteCasinoCategoryError: null,
			};

		case DELETE_CASINO_CATEGORY_SUCCESS:
			return {
				...state,
				isDeleteCasinoCategoryLoading: false,
				isDeleteCasinoCategorySuccess: true,
				isDeleteCasinoCategoryError: null,
			};

		case DELETE_CASINO_CATEGORY_FAIL:
			return {
				...state,
				isDeleteCasinoCategoryLoading: false,
				isDeleteCasinoCategorySuccess: false,
				isDeleteCasinoCategoryError: payload,
			};

		case REORDER_CASINO_CATEGORY_START:
			return {
				...state,
				isReorderCasinoCategoryLoading: true,
				isReorderCasinoCategorySuccess: false,
				isReorderCasinoCategoryError: null,
			};

		case REORDER_CASINO_CATEGORY_SUCCESS:
			return {
				...state,
				isReorderCasinoCategoryLoading: false,
				isReorderCasinoCategorySuccess: true,
				isReorderCasinoCategoryError: null,
			};

		case REORDER_CASINO_CATEGORY_FAIL:
			return {
				...state,
				isReorderCasinoCategoryLoading: false,
				isReorderCasinoCategorySuccess: false,
				isReorderCasinoCategoryError: payload,
			};

		case REORDER_CASINO_GAMES_START:
			return {
				...state,
				isReorderCasinoGamesLoading: true,
				isReorderCasinoGamesSuccess: false,
				isReorderCasinoGamesError: null,
			};

		case REORDER_CASINO_GAMES_SUCCESS:
			return {
				...state,
				isReorderCasinoGamesLoading: false,
				isReorderCasinoGamesSuccess: true,
				isReorderCasinoGamesError: null,
			};

		case REORDER_CASINO_GAMES_FAIL:
			return {
				...state,
				isReorderCasinoGamesLoading: false,
				isReorderCasinoGamesSuccess: false,
				isReorderCasinoGamesError: payload,
			};

		case RESET_CASINO_STATE:
			return {
				...INIT_STATE,
			};

		case GET_ADDED_GAMES_IN_CATEGORY_START:
			return {
				...state,
				isCategoryAddedGamesLoading: true,
				categoryAddedGames: null,
				categoryAddedGamesError: null,
			};

		case GET_ADDED_GAMES_IN_CATEGORY_SUCCESS:
			return {
				...state,
				isCategoryAddedGamesLoading: false,
				categoryAddedGames: payload,
				categoryAddedGamesError: null,
			};

		case GET_ADDED_GAMES_IN_CATEGORY_FAIL:
			return {
				...state,
				categoryAddedGamesError: payload,
				isCategoryAddedGamesLoading: false,
				categoryAddedGames: null,
			};

		case REMOVE_GAME_FROM_CATEGORY_START:
			return {
				...state,
				isRemoveGameFromCategoryLoading: true,
				isRemoveGameFromCategorySuccess: false,
				isRemoveGameFromCategoryError: null,
			};

		case REMOVE_GAME_FROM_CATEGORY_SUCCESS:
			return {
				...state,
				isRemoveGameFromCategoryLoading: false,
				isRemoveGameFromCategorySuccess: true,
				isRemoveGameFromCategoryError: null,
			};

		case REMOVE_GAME_FROM_CATEGORY_FAIL:
			return {
				...state,
				isRemoveGameFromCategoryLoading: false,
				isRemoveGameFromCategorySuccess: false,
				isRemoveGameFromCategoryError: payload,
			};

		default:
			return state;
	}
};

export default CasinoManagementData;
