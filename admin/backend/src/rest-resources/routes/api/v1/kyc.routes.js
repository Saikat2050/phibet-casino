import { KycDocumentController } from '@src/rest-resources/controllers/kyc/kycDocument.controller'
import { KycStatusController } from '@src/rest-resources/controllers/kyc/kycStatus.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { getUserDocumentsSchema } from '@src/schema/kyc/getUserDocuments.schema'
import { approveDocumentSchema } from '@src/schema/kyc/approveDocument.schema'
import { rejectDocumentSchema } from '@src/schema/kyc/rejectDocument.schema'
import { updateKycStatusSchema } from '@src/schema/kyc/updateKycStatus.schema'
import { successSchema } from '@src/schema/successResponse.schema'
import { resources } from '@src/utils/constants/permission.constant'

import express from 'express'

const kycRouter = express.Router()

// Document Management Routes
kycRouter.get('/documents', 
  isAuthenticated(resources.kyc.read), 
  KycDocumentController.getKycDocuments, 
  responseValidationMiddleware({})
)
kycRouter.get('/documents_labels', 
  isAuthenticated(resources.kyc.read), 
  KycDocumentController.getKycDocumentLabels, 
  responseValidationMiddleware({})
)
kycRouter.get('/logs', 
  isAuthenticated(resources.kyc.read), 
  KycDocumentController.getKycLogs, 
  responseValidationMiddleware({})
)

kycRouter.get('/requested-kyc', 
  isAuthenticated(resources.kyc.read), 
  KycDocumentController.getrequestedKyc, 
  responseValidationMiddleware({})
)

kycRouter.put('/documents/approve', 
  isAuthenticated(resources.kyc.verify_kyc), 
  requestValidationMiddleware(approveDocumentSchema),
  databaseTransactionHandlerMiddleware, 
  KycDocumentController.approveDocument, 
  responseValidationMiddleware(successSchema)
)

kycRouter.post('/document_labels', 
  isAuthenticated(resources.kyc.create), 
  requestValidationMiddleware({}),
  databaseTransactionHandlerMiddleware, 
  KycDocumentController.documentLabels, 
  responseValidationMiddleware({})
)


kycRouter.put('/documents/reject', 
  isAuthenticated(resources.kyc.verify_kyc), 
  requestValidationMiddleware(rejectDocumentSchema),
  databaseTransactionHandlerMiddleware, 
  KycDocumentController.rejectDocument, 
  responseValidationMiddleware(successSchema)
)

// KYC Status Management Routes
kycRouter.put('/status/update', 
  isAuthenticated(resources.kyc.update), 
  requestValidationMiddleware(updateKycStatusSchema),
  databaseTransactionHandlerMiddleware, 
  KycStatusController.updateKycStatus, 
  responseValidationMiddleware(successSchema)
)

// Get user documents by userId (for admin to view specific user's documents)
kycRouter.get('/documents/user/:userId', 
  isAuthenticated(resources.kyc.read), 
  KycDocumentController.getUserDocuments, 
  responseValidationMiddleware(getUserDocumentsSchema)
)

// Delete/Remove document labels (DELETE operation for CRUD)
kycRouter.delete('/document_labels/:labelId', 
  isAuthenticated(resources.kyc.delete), 
  databaseTransactionHandlerMiddleware, 
  KycDocumentController.deleteDocumentLabel, 
  responseValidationMiddleware(successSchema)
)
export { kycRouter }
