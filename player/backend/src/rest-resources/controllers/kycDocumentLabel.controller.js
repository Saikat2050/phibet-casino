import { decorateResponse } from '@src/helpers/response.helpers'
import GetDocumentLabelsService from '@src/services/kyc/getDocumentLabels.service'

export default class KycDocumentLabelController {
  static async getDocumentLabels (req, res, next) {
    try {
      const result = await GetDocumentLabelsService.execute({...req.query,userId:req.authenticated.userId}, req.context)

      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  // static async getRequiredLabels (req, res, next) {
  //   try {
  //     const result = await GetDocumentLabelsService.execute({
  //       isRequired: true
  //     }, req.context)
  //     decorateResponse({ req, res, next }, result)
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}
