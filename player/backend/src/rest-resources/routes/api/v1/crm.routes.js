import { UserDisputeController } from '@src/rest-resources/controllers/crm.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const supportedFileFormat = ['png', 'jpg', 'jpeg']
const crmRouter = express.Router({ mergeParams: true })

// user dispute-managemnt
crmRouter.get('/dispute-management/get-ticket', isAuthenticated, UserDisputeController.getTicket, responseValidationMiddleware({}))
crmRouter.get('/dispute-management/get-ticket-details', isAuthenticated, UserDisputeController.getTicketDetails, responseValidationMiddleware({}))
crmRouter.post('/dispute-management/raise-ticket', isAuthenticated, databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('file'), UserDisputeController.raiseTicket, responseValidationMiddleware({}))
crmRouter.post('/dispute-management/create-message', isAuthenticated, databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormat).single('file'), UserDisputeController.createMessage, responseValidationMiddleware({}))
crmRouter.post('/dispute-management/update-read', isAuthenticated, databaseTransactionHandlerMiddleware, UserDisputeController.updateMessageRead, responseValidationMiddleware({}))
crmRouter.post('/dispute-management/update-status', isAuthenticated, databaseTransactionHandlerMiddleware, UserDisputeController.updateStatus, responseValidationMiddleware({}))

export { crmRouter }
