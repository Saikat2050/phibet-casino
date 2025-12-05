import { CasinMoanagementController } from '@src/rest-resources/controllers/casinoManagement.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import express from 'express'
import { successSchema } from '@src/schema/successResponse.schema'
import { createCategorySchema } from '@src/schema/casino/createCategory.schema'
import { editProviderSchema } from '@src/schema/casino/editProvider.schema'
import { editGameSchema } from '@src/schema/casino/editGame.schema'
import { getAggregatorsSchema } from '@src/schema/casino/getAggreator.schema'
import { getProvidersSchema } from '@src/schema/casino/getProvider.schema'
import { getCategoriesSchema } from '@src/schema/casino/getCategory.schema'
import { getGamesSchema } from '@src/schema/casino/getGames.schema'
import { editGameSchemaStates } from '@src/schema/casino/editGameSchemaStates'
import { editProviderSchemaStates } from '@src/schema/casino/editProviderSchemaStates'

const supportedFileFormats = ['png', 'jpg', 'jpeg', 'tiff', 'svg+xml', 'webp', 'svg']
const casinoManagementRouter = express.Router()

// GET REQUESTS
casinoManagementRouter.get('/aggregators', isAuthenticated(resources.casinoManagement.read), CasinMoanagementController.getAggregators, responseValidationMiddleware(getAggregatorsSchema))
casinoManagementRouter.get('/providers', isAuthenticated(resources.casinoManagement.read), CasinMoanagementController.getProviders, responseValidationMiddleware(getProvidersSchema))
casinoManagementRouter.get('/categories', isAuthenticated(resources.casinoManagement.read), CasinMoanagementController.getCategories, responseValidationMiddleware(getCategoriesSchema))
casinoManagementRouter.get('/games', isAuthenticated(resources.casinoManagement.read), CasinMoanagementController.getGames, responseValidationMiddleware(getGamesSchema))
casinoManagementRouter.get('/load-casino-games', isAuthenticated(resources.casinoManagement.create), CasinMoanagementController.getLoadCasinoGames, responseValidationMiddleware({}))

// POST REQUESTS
casinoManagementRouter.post('/category', isAuthenticated(resources.casinoManagement.create), fileUpload(supportedFileFormats).single('file'), CasinMoanagementController.createCategory, responseValidationMiddleware(createCategorySchema))

// PUT REQUESTS
casinoManagementRouter.put('/remove-restricted-states-for-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.removeRestrictedStateGame, responseValidationMiddleware(editGameSchemaStates))
casinoManagementRouter.put('/remove-restricted-states-for-provider', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.removeRestrictedStateProvider, responseValidationMiddleware(editProviderSchemaStates))
casinoManagementRouter.put('/restrict-states-for-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.restrictedStateForGame, responseValidationMiddleware(editGameSchemaStates))
casinoManagementRouter.put('/restrict-states-for-provider', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.restrictedStateForProvider, responseValidationMiddleware(editProviderSchemaStates))
casinoManagementRouter.put('/toggle-featured-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.toggleFeaturedGame, responseValidationMiddleware(successSchema))
casinoManagementRouter.put('/toggle-landing-page-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.toggleLandingPageGame, responseValidationMiddleware(successSchema))
casinoManagementRouter.put('/reorder-category', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.reorderCategory, responseValidationMiddleware(successSchema))
casinoManagementRouter.put('/reorder-games', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.reorderGames, responseValidationMiddleware(successSchema))
casinoManagementRouter.put('/reorder-providers', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.reorderProvider, responseValidationMiddleware(successSchema))
casinoManagementRouter.put('/toggle', isAuthenticated(resources.casinoManagement.toggle_status), CasinMoanagementController.toggle, responseValidationMiddleware(successSchema))
casinoManagementRouter.put('/category', isAuthenticated(resources.casinoManagement.update), fileUpload(supportedFileFormats).single('file'), CasinMoanagementController.editCategory, responseValidationMiddleware(createCategorySchema))
casinoManagementRouter.put('/provider', isAuthenticated(resources.casinoManagement.update), fileUpload(supportedFileFormats).single('file'), CasinMoanagementController.editProvider, responseValidationMiddleware(editProviderSchema))
casinoManagementRouter.put('/game', isAuthenticated(resources.casinoManagement.update), fileUpload(supportedFileFormats).any(), CasinMoanagementController.editGame, responseValidationMiddleware(editGameSchema))
casinoManagementRouter.post('/add-games-to-category', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.addGamesCategory, responseValidationMiddleware(successSchema))
casinoManagementRouter.put('/remove-games-from-category', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.removeGamesFromCategory, responseValidationMiddleware(successSchema))
casinoManagementRouter.put('/remove-restricted-countries-for-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.removeRestrictedCountryGame, responseValidationMiddleware(editGameSchema))
casinoManagementRouter.put('/remove-restricted-countries-for-provider', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.removeRestrictedCountryProvider, responseValidationMiddleware(editProviderSchema))
casinoManagementRouter.put('/restrict-countries-for-game', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.restrictedCountryForGame, responseValidationMiddleware(editGameSchema))
casinoManagementRouter.put('/restrict-countries-for-provider', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.restrictedCountryForProvider, responseValidationMiddleware(editProviderSchema))

// DELETE REQUESTS
casinoManagementRouter.delete('/delete-category', isAuthenticated(resources.casinoManagement.update), CasinMoanagementController.deleteCategory, responseValidationMiddleware(successSchema))

export { casinoManagementRouter }
