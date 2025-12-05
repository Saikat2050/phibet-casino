import { GetPagesService } from '../../services/pageContent'
import { sendResponse } from '../../utils/response.helpers'

export default class PageContentController {
  static async getPages (req, res, next) {
    try {
      const { result, successful, errors } = await GetPagesService.execute({ ...req.body, ...req.query }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
