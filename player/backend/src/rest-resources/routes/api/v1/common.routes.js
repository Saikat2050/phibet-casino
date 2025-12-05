import { CommonController } from '@src/rest-resources/controllers/common.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { getCurrenciesSchema, getLanguagesSchema, getPagesSchema, getSettingsSchema } from '@src/schema/common'
import { isSemiAuthenticated } from '@src/rest-resources/middlewares/isSemiAuthenticated'
import express from 'express'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'

const commonRouter = express.Router({ mergeParams: true })

// GET REQUESTS
commonRouter.get('/pages', requestValidationMiddleware(getPagesSchema), CommonController.getPages, responseValidationMiddleware({}))
commonRouter.get('/settings', CommonController.getSettings, responseValidationMiddleware(getSettingsSchema))
commonRouter.get('/banners', CommonController.getBanners, responseValidationMiddleware({}))
commonRouter.get('/languages', CommonController.getLanguages, responseValidationMiddleware(getLanguagesSchema))
commonRouter.get('/countries', CommonController.getCountries, responseValidationMiddleware({}))
commonRouter.get('/currencies', CommonController.getCurrencies, responseValidationMiddleware(getCurrenciesSchema))
commonRouter.get('/paymentProviders', CommonController.getPaymentProviders, responseValidationMiddleware({}))
commonRouter.get('/states', CommonController.getStates, responseValidationMiddleware({}))
commonRouter.get('/user-notification', isSemiAuthenticated, CommonController.getUserNotification, responseValidationMiddleware({}))
commonRouter.get('/top-winners', CommonController.getTopWinners, responseValidationMiddleware({}))
commonRouter.get('/seo-pages', CommonController.getAllSeoPages, responseValidationMiddleware({}))
commonRouter.get('/geocomply/license-string', CommonController.getLicenseString, responseValidationMiddleware({}))
commonRouter.get('/testimonials', CommonController.getTestimonials, responseValidationMiddleware({}))

// POST REQUESTS
commonRouter.post('/geocomply/decode-token', CommonController.decodeResponseToken, responseValidationMiddleware({}))
commonRouter.post('/notification/subscribe', isAuthenticated, CommonController.notificationSubscribe, responseValidationMiddleware({}))
export { commonRouter }
