/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
import { put, takeLatest, all, fork, select } from 'redux-saga/effects';

import {
	getCasinoProvidersDataSuccess,
	getCasinoProvidersDataFailure,
	getCasinoCategoryDetailSuccess,
	getCasinoCategoryDetailFailure,
	getCasinoGamesSuccess,
	getCasinoGamesFailure,
	getLanguagesSuccess,
	getLanguagesFailure,
	createCasinoProvidersSuccess,
	createCasinoProvidersFailure,
	createCasinoCategorySuccess,
	createCasinoCategoryFailure,
	updateCasinoStatusSuccess,
	updateCasinoStatusFail,
	editCasinoCategorySuccess,
	editCasinoCategoryFailure,
	editCasinoProvidersSuccess,
	editCasinoProvidersFailure,
	editCasinoGamesSuccess,
	editCasinoGamesFailure,
	updateCasinoIsFeaturedSuccess,
	updateCasinoIsFeaturedFailure,
	addGameToCategorySuccess,
	addGameToCategoryFail,
	deleteCasinoCategorySuccess,
	deleteCasinoCategoryFail,
	reorderCasinoCategorySuccess,
	reorderCasinoCategoryFail,
	reorderCasinoGamesSuccess,
	reorderCasinoGamesFail,
	getAddedGamesInCategorySuccess,
	getAddedGamesInCategoryFail,
	removeGameFromCategorySuccess,
	removeGameFromCategoryFail,
	addGameSuccess,
	addGameFail,
	getCasinoGamesStart,
	reorderCasinoProviderSuccess,
	reorderCasinoProviderFail,
	updateCasinoLandingPageSuccess,
	updateCasinoLandingPageFailure,
} from './actions';

import {
	GET_CASINO_CATEGORY_DATA,
	GET_LANGUAGE_DATA_START,
	GET_CASINO_PROVIDERS_DATA,
	GET_CASINO_GAMES,
	CREATE_CASINO_PROVIDERS,
	CREATE_CASINO_CATEGORY_START,
	UPDATE_CASINO_STATUS_START,
	EDIT_CASINO_CATEGORY,
	EDIT_CASINO_PROVIDERS,
	EDIT_CASINO_GAMES_START,
	UPDATE_GAME_ISFEATURED_START,
	UPDATE_LANDING_PAGE_GAME_START,
	ADD_GAME_TO_CASINO_CATEGORY_START,
	DELETE_CASINO_CATEGORY_START,
	REORDER_CASINO_CATEGORY_START,
	REORDER_CASINO_GAMES_START,
	GET_ADDED_GAMES_IN_CATEGORY_START,
	REMOVE_GAME_FROM_CATEGORY_START,
	ADD_GAMES_START,
	REORDER_CASINO_PROVIDER_START,
} from './actionTypes';

import {
	addCasinoGames,
	getAllCasinoGames,
	getAllCasinoProviders,
	getCasinoCategoryListing,
	getLanguages,
} from '../../network/getRequests';

import {
	createCasinoCategory,
	addProviderCredentials,
	addGamesToCategory,
} from '../../network/postRequests';
import {
	isCasinoFeaturedService,
	casinoManagementToggle,
	editCasinoCategory,
	updateCategoryReOrder,
	updateReorderGames,
	editCasinoGames,
	editCasinoProvider,
	removeGamesFromCategory,
	updateReorderProviders,
	isCasinoLandingGameService,
} from '../../network/putRequests';

import { objectToFormData } from '../../utils/objectToFormdata';
import { showToastr } from '../../utils/helpers';
import { formPageTitle } from '../../components/Common/constants';
import { deleteCategory } from '../../network/deleteRequests';
import { filterEmptyPayload } from '../../network/networkUtils';

function* getCasinoCategoryWorker(action) {
	const payload = action && action.payload;
	try {
		const { data } = yield getCasinoCategoryListing(payload);
		yield put(getCasinoCategoryDetailSuccess(data?.data));
	} catch (error) {
		showToastr({ message: 'Something Went wrong', type: 'error' });
		yield put(
			getCasinoCategoryDetailFailure(
				error?.response?.data?.errors[0]?.description
			)
		);
	}
}

function* getCategoryAddedGamesWorker(action) {
	const payload = action && action.payload;
	try {
		const { data } = yield getAllCasinoGames(payload);
		yield put(getAddedGamesInCategorySuccess(data?.data));
	} catch (error) {
		showToastr({ message: 'Unable to fetch games', type: 'error' });
		yield put(
			getAddedGamesInCategoryFail(error?.response?.data?.errors[0]?.description)
		);
	}
}

function* addNewGamesWorker(action) {
	const payload = action && action.payload;
	try {
		const { data } = yield addCasinoGames(payload);
		showToastr({ message: 'new games added', type: 'success' });
		yield put(getCasinoGamesStart());
		yield put(addGameSuccess(data?.data));
	} catch (error) {
		showToastr({ message: 'unable to add new games', type: 'error' });
		yield put(addGameFail(error?.response?.data?.errors[0]?.description));
	}
}

function* removeCategoryAddedGamesWorker(action) {
	const { navigate, ...payload } = action && action.payload;
	try {
		yield removeGamesFromCategory(payload);
		yield put(removeGameFromCategorySuccess());
		showToastr({ message: 'Games Removed Successfully', type: 'success' });

		if (navigate) {
			navigate('/categories');
		}
	} catch (error) {
		showToastr({
			message: error?.response?.data?.errors[0]?.description || error?.message,
			type: 'error',
		});
		yield put(
			removeGameFromCategoryFail(error?.response?.data?.errors[0]?.description)
		);
	}
}

function* getLanguagesWorker(action) {
	try {
		const payload = action && action.payload;

		const { data } = yield getLanguages(payload);

		yield put(getLanguagesSuccess(data?.data));
	} catch (error) {
		showToastr({ message: 'Something Went wrong', type: 'error' });
		yield put(
			getLanguagesFailure(error?.response?.data?.errors[0].description)
		);
	}
}

function* getAllCasinoProvidersWorker(action) {
	try {
		const payload = action && action.payload;
		const { data } = yield getAllCasinoProviders(payload);
		yield put(getCasinoProvidersDataSuccess(data?.data));
	} catch (e) {
		showToastr({
			message: e?.response?.data?.errors[0].description,
			type: 'error',
		});
		yield put(
			getCasinoProvidersDataFailure(e?.response?.data?.errors[0].description)
		);
	}
}

function* getAllCasinoGamesWorker(action) {
	try {
		const payload = action && action.payload;

		const { data } = yield getAllCasinoGames(payload);

		yield put(getCasinoGamesSuccess(data?.data));
	} catch (e) {
		yield showToastr({
			message: e?.response?.data?.errors[0]?.description,
			type: 'error',
		});

		yield put(getCasinoGamesFailure(e?.response?.data?.errors[0]?.description));
	}
}

function* createCasinoProviderWorker(action) {
	try {
		const { data } = action && action.payload;
		yield addProviderCredentials(objectToFormData(filterEmptyPayload(data)));

		showToastr({
			message: `Provider Created Successfully`,
			type: 'success',
		});
		window.localStorage.removeItem(formPageTitle.providers);

		yield put(createCasinoProvidersSuccess());
	} catch (e) {
		yield put(createCasinoProvidersFailure());
	}
}

function* editCasinoProviderWorker(action) {
	try {
		const { data } = action && action.payload;
		yield editCasinoProvider(objectToFormData(filterEmptyPayload(data)));

		showToastr({
			message: `Provider Updated Successfully`,
			type: 'success',
		});

		yield put(editCasinoProvidersSuccess());
	} catch (e) {
		yield put(editCasinoProvidersFailure());
	}
}

function* createCasinoCategoryWorker(action) {
	try {
		const { payload, handleCallback } = action && action.payload;
		yield createCasinoCategory(payload);
		if (handleCallback) handleCallback();
		showToastr({
			message: `Category Created Successfully`,
			type: 'success',
		});

		window.localStorage.removeItem(formPageTitle.categories);

		yield put(createCasinoCategorySuccess());
	} catch (e) {
		yield put(createCasinoCategoryFailure());
	}
}

function* editCasinoCategoryWorker(action) {
	try {
		const { data } = action && action.payload;
		yield editCasinoCategory(data);

		showToastr({
			message: `Category Updated Successfully`,
			type: 'success',
		});

		yield put(editCasinoCategorySuccess());
	} catch (e) {
		yield put(editCasinoCategoryFailure());
	}
}

function* updateCasinoStatusWorker(action) {
	try {
		const payload = action && action.payload;

		yield casinoManagementToggle(payload);

		showToastr({
			message: `Status Updated Successfully`,
			type: 'success',
		});

		switch (payload.type) {
			case 'provider': {
				const providerList = yield select(
					(state) => state.CasinoManagementData.casinoProvidersData
				);

				const updatedProviderList = providerList?.providers?.map((provider) => {
					if (provider.id === payload.id) {
						provider.isActive = !provider.isActive;
					}
					return provider;
				});

				yield put(
					getCasinoProvidersDataSuccess({
						...providerList,
						providers: updatedProviderList,
					})
				);
				break;
			}

			case 'category': {
				const { casinoCategoryDetails } = yield select(
					(state) => state.CasinoManagementData
				);

				const updatedCasinoGames = casinoCategoryDetails?.categories?.map(
					(cate) => {
						if (cate.id === payload.id) {
							cate.isActive = !cate.isActive;
						}
						return cate;
					}
				);

				yield put(
					getCasinoCategoryDetailSuccess({
						...casinoCategoryDetails,
						categories: updatedCasinoGames,
					})
				);
				break;
			}

			case 'game': {
				const { casinoGames } = yield select(
					(state) => state.CasinoManagementData
				);

				const updatedCasinoGames = casinoGames?.games?.map((game) => {
					if (game.id === payload.id) {
						game.isActive = !game.isActive;
					}
					return game;
				});

				yield put(
					getCasinoGamesSuccess({
						...casinoGames,
						games: updatedCasinoGames,
					})
				);
			}
		}

		yield put(updateCasinoStatusSuccess());
	} catch (e) {
		yield put(updateCasinoStatusFail());
	}
}

function* editCasinoGamesWorker(action) {
	try {
		const { data } = action && action.payload;

		yield editCasinoGames(objectToFormData(data));

		showToastr({
			message: `Game Updated Successfully`,
			type: 'success',
		});

		yield put(editCasinoGamesSuccess());
	} catch (e) {
		yield put(editCasinoGamesFailure());
	}
}

function* updateGameFeatured(action) {
	try {
		const data = {
			gameId: action.payload.gameId,
		};
		yield isCasinoFeaturedService(data);
		yield put(updateCasinoIsFeaturedSuccess(action.payload));
	} catch (error) {
		yield put(updateCasinoIsFeaturedFailure(error));
	}
}

function* updateLandingGame(action) {
	try {
		const data = {
			gameId: action.payload.gameId,
		};
		yield isCasinoLandingGameService(data);
		yield put(updateCasinoLandingPageSuccess(action.payload));
	} catch (error) {
		yield put(updateCasinoLandingPageFailure(error));
	}
}

function* addGamesToCategoryWorker(action) {
	try {
		const data = action && action.payload;

		yield addGamesToCategory(data);

		showToastr({
			message: 'Games Added To Category',
			type: 'success',
		});
		if (data?.navigate) {
			data.navigate('/categories');
		}

		yield put(addGameToCategorySuccess());
	} catch (e) {
		yield put(addGameToCategoryFail());
	}
}

function* deleteCasinoCategoryWorker(action) {
	try {
		const { categoryId } = action && action.payload;

		yield deleteCategory({
			categoryId,
		});

		const { casinoCategoryDetails } = yield select(
			(state) => state.CasinoManagementData
		);

		const updatedCasinoGames = casinoCategoryDetails?.categories?.filter(
			(cate) => cate.id !== categoryId
		);

		yield put(
			getCasinoCategoryDetailSuccess({
				...casinoCategoryDetails,
				categories: updatedCasinoGames,
			})
		);

		showToastr({
			message: 'Category Deleted Successfully',
			type: 'success',
		});

		yield put(deleteCasinoCategorySuccess());
	} catch (e) {
		yield put(deleteCasinoCategoryFail());
	}
}

function* updateCategoryOrder(action) {
	try {
		const { data, navigate } = action && action.payload;
		yield updateCategoryReOrder(data);
		yield put(reorderCasinoCategorySuccess());

		showToastr({
			message: 'Category Order Updated Successfully',
			type: 'success',
		});
		navigate('/categories');
	} catch (e) {
		yield put(reorderCasinoCategoryFail());
	}
}

function* updateReorderGamesWorker(action) {
	try {
		const { data, navigate } = action && action.payload;
		yield updateReorderGames({ data });

		yield put(reorderCasinoGamesSuccess());

		showToastr({
			message: 'Games Order Updated Successfully',
			type: 'success',
		});

		navigate('/casino-games');
	} catch (e) {
		yield put(
			reorderCasinoGamesFail(e?.response?.data?.errors[0]?.description)
		);
	}
}

function* updateReorderProviderWorker(action) {
	try {
		const { data, navigate } = action && action.payload;
		yield updateReorderProviders({ data });

		yield put(reorderCasinoProviderSuccess());

		showToastr({
			message: 'Providers Order Updated Successfully',
			type: 'success',
		});

		navigate('/casino-providers');
	} catch (e) {
		yield put(
			reorderCasinoProviderFail(e?.response?.data?.errors[0]?.description)
		);
	}
}

export function* casinoManagementWatcher() {
	yield takeLatest(GET_CASINO_CATEGORY_DATA, getCasinoCategoryWorker);
	yield takeLatest(GET_LANGUAGE_DATA_START, getLanguagesWorker);
	yield takeLatest(GET_CASINO_PROVIDERS_DATA, getAllCasinoProvidersWorker);
	yield takeLatest(GET_CASINO_GAMES, getAllCasinoGamesWorker);
	yield takeLatest(CREATE_CASINO_PROVIDERS, createCasinoProviderWorker);
	yield takeLatest(EDIT_CASINO_CATEGORY, editCasinoCategoryWorker);
	yield takeLatest(CREATE_CASINO_CATEGORY_START, createCasinoCategoryWorker);

	yield takeLatest(UPDATE_CASINO_STATUS_START, updateCasinoStatusWorker);

	yield takeLatest(EDIT_CASINO_PROVIDERS, editCasinoProviderWorker);
	yield takeLatest(EDIT_CASINO_GAMES_START, editCasinoGamesWorker);
	yield takeLatest(UPDATE_GAME_ISFEATURED_START, updateGameFeatured);
	yield takeLatest(UPDATE_LANDING_PAGE_GAME_START, updateLandingGame);
	yield takeLatest(ADD_GAME_TO_CASINO_CATEGORY_START, addGamesToCategoryWorker);
	yield takeLatest(DELETE_CASINO_CATEGORY_START, deleteCasinoCategoryWorker);
	yield takeLatest(REORDER_CASINO_CATEGORY_START, updateCategoryOrder);
	yield takeLatest(REORDER_CASINO_GAMES_START, updateReorderGamesWorker);
	yield takeLatest(REORDER_CASINO_PROVIDER_START, updateReorderProviderWorker);
	yield takeLatest(
		GET_ADDED_GAMES_IN_CATEGORY_START,
		getCategoryAddedGamesWorker
	);
	yield takeLatest(
		REMOVE_GAME_FROM_CATEGORY_START,
		removeCategoryAddedGamesWorker
	);
	yield takeLatest(ADD_GAMES_START, addNewGamesWorker);
}

function* CasinoManagementSaga() {
	yield all([fork(casinoManagementWatcher)]);
}

export default CasinoManagementSaga;
