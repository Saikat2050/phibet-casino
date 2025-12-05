import express from 'express'
import requestValidationMiddleware from '../../../middlewares/requestValidation.middleware'
import responseValidationMiddleware from '../../../middlewares/responseValidation.middleware'
import PageContentController from '../../../controllers/page-content.controller'

const args = { mergeParams: true }
const pageContentRoutes = express.Router(args)

pageContentRoutes
  .route('/')
  .get(
    requestValidationMiddleware({}),
    PageContentController.getPages,
    responseValidationMiddleware({})
  )

export default pageContentRoutes
