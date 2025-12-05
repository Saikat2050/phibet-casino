import { decorateResponse } from '@src/helpers/response.helpers'
import UploadDocumentService from '@src/services/kyc/uploadDocument.service'
import DeleteDocumentService from '@src/services/kyc/deleteDocument.service'
import ReUploadDocumentService from '@src/services/kyc/reUploadDocument.service'
import GetUserDocumentsService from '@src/services/kyc/getUserDocuments.service'
import { GetUserDocumentService } from '@src/services/kyc/getUserDocument.service'

export default class KycDocumentController {
  static async uploadDocument (req, res, next) {
    try {
      const result = await UploadDocumentService.execute({...req.body,file: req.file,userId:req.authenticated.userId}, req.context)

      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  static async getMyDocuments (req, res, next) {
    try {
      const result = await GetUserDocumentsService.execute({...req.query,userId:req.authenticated.userId}, req.context)
      decorateResponse({ req, res, next }, result)

    } catch (error) {

      next(error)
    }

  }

  static async getDocument (req, res, next) {
    try {

      const result = await GetUserDocumentService.execute({...req.query,userId:req.authenticated.userId}, req.context)

      decorateResponse({ req, res, next }, result)

    } catch (error) {
      next(error)
    }
  }

  // static async deleteDocument (req, res, next) {
  //   const transaction = await sequelize.transaction()
  //   try {
  //     const result = await DeleteDocumentService.execute({
  //       userId: req.authenticated.userId,
  //       documentId: req.params.documentId,
  //       transaction
  //     }, req.context)
  //     if (result.errors && Object.keys(result.errors).length) await transaction.rollback()
  //     else await transaction.commit()
  //     decorateResponse({ req, res, next }, result)
  //   } catch (error) {
  //     await transaction.rollback()
  //     next(error)
  //   }
  // }

  // static async reUploadDocument (req, res, next) {
  //   const transaction = await sequelize.transaction()
  //   try {
  //     const result = await ReUploadDocumentService.execute({
  //       userId: req.authenticated.userId,
  //       documentId: req.params.documentId,
  //       file: req.file,
  //       transaction
  //     }, req.context)
  //     if (result.errors && Object.keys(result.errors).length) await transaction.rollback()
  //     else await transaction.commit()
  //     decorateResponse({ req, res, next }, result)
  //   } catch (error) {
  //     await transaction.rollback()
  //     next(error)
  //   }
  // }
}
