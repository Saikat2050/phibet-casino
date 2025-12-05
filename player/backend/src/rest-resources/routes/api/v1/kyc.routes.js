import express from 'express'
import KycDocumentController from '@src/rest-resources/controllers/kycDocument.controller'
import KycStatusController from '@src/rest-resources/controllers/kycStatus.controller'
import KycDocumentLabelController from '@src/rest-resources/controllers/kycDocumentLabel.controller'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import uploadDocumentSchema from '@src/schema/kyc/uploadDocument.schema'
import getDocumentsSchema from '@src/schema/kyc/getDocuments.schema'
import getDocumentLabelsSchema from '@src/schema/kyc/getDocumentLabels.schema'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { fileUpload } from '@src/rest-resources/middlewares/multer'

const router = express.Router()
const supportedFileFormat = ['png', 'jpg', 'jpeg']


router.post('/documents/upload',
  isAuthenticated,
  fileUpload(supportedFileFormat).single('file'),
  requestValidationMiddleware({ body: uploadDocumentSchema }),
  KycDocumentController.uploadDocument,
  responseValidationMiddleware({})
)

router.get('/documents/my-documents',
  isAuthenticated,
  requestValidationMiddleware({ query: getDocumentsSchema }),
  KycDocumentController.getMyDocuments,
  responseValidationMiddleware({})
)

router.get('/document',
  isAuthenticated,
  KycDocumentController.getDocument,
  responseValidationMiddleware({})

)
router.get('/status',
  isAuthenticated,
  KycStatusController.getKycStatus,
  responseValidationMiddleware({})

)

router.post('/request-verification',
  isAuthenticated,
  KycStatusController.requestVerification,
  responseValidationMiddleware({})

)
router.get('/document-labels',
  isAuthenticated,
  requestValidationMiddleware({ query: getDocumentLabelsSchema }),
  KycDocumentLabelController.getDocumentLabels,
  responseValidationMiddleware({})

)


// router.delete('/document',
//   isAuthenticated,
//   KycDocumentController.deleteDocument,
//   responseValidationMiddleware({})

// )



export default router
