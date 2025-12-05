import { decorateResponse } from '@src/helpers/response.helpers'
import { GetUserDocumentsService } from '@src/services/kyc/getUserDocuments.service'
import { ApproveDocumentService } from '@src/services/kyc/approveDocument.service'
import UpsertDocumentLabelService from '@src/services/kyc/documentLabel.service'
import DeleteDocumentLabelService from '@src/services/kyc/deleteDocumentLabel.service'
import GetKycActivityLogsService from '@src/services/kyc/getKycActivityLogs.service'
import { GetKycDocumentsService } from '@src/services/kyc/getKycDocuments.service'
import GetRequestedKycService from '@src/services/kyc/getRequestedKyc'
import { RejectDocumentService } from '@src/services/kyc/rejectDocument.service'
import { GetKycDocumentLabelsService } from '@src/services/kyc/getKycDocumentLabels.service'

export class KycDocumentController {
  /**
   * Get user documents
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
 
  /**
   * Get pending documents for review
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getKycDocuments (req, res, next) {
    try {
      const result = await GetKycDocumentsService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

    /**
   * Get pending documents for review
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getKycDocumentLabels (req, res, next) {
    try {
      const result = await GetKycDocumentLabelsService.execute({ ...req.query }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

    /**
   * Get pending documents for review
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
    static async getKycLogs (req, res, next) {
      try {
        const result = await GetKycActivityLogsService.execute({ 
          ...req.query, 
          adminUserId: req.authenticated.adminUserId 
        }, req.context)
        // const result = await GetKycActivityLogsService.execute({ ...req.query }, req.context)
        decorateResponse({ req, res, next }, result)
      } catch (error) {
        next(error)
      }
    }

    /**
   * Get pending documents for review
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
    static async getrequestedKyc (req, res, next) {
      try {
        const result = await GetRequestedKycService.execute({ 
          ...req.query, 
          adminUserId: req.authenticated.adminUserId 
        }, req.context)
        // const result = await GetKycActivityLogsService.execute({ ...req.query }, req.context)
        decorateResponse({ req, res, next }, result)
      } catch (error) {
        next(error)
      }
    }

  /**
   * Approve document
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async approveDocument (req, res, next) {
    try {
      const result = await ApproveDocumentService.execute({ 
        ...req.body, 
        adminUserId: req.authenticated.adminUserId 
      }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

    /**
   * Approve document
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
    static async documentLabels (req, res, next) {
      try {
        const result = await UpsertDocumentLabelService.execute({ 
          ...req.body, 
          adminUserId: req.authenticated.adminUserId 
        }, req.context)
        decorateResponse({ req, res, next }, result)
      } catch (error) {
        next(error)
      }
    }


    
    
  /**
   * Reject document
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async rejectDocument (req, res, next) {
    try {
      const result = await RejectDocumentService.execute({ 
        ...req.body, 
        adminUserId: req.authenticated.adminUserId 
      }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get user documents by userId
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getUserDocuments (req, res, next) {
    try {
      const result = await GetUserDocumentsService.execute({ ...req.query, ...req.params }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete document label
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async deleteDocumentLabel (req, res, next) {
    try {
      const result = await DeleteDocumentLabelService.execute({ 
        ...req.params, 
        adminUserId: req.authenticated.adminUserId 
      }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

}
