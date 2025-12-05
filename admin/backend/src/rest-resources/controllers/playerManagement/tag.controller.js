import { decorateResponse } from '@src/helpers/response.helpers'
import { AttachTagService } from '@src/services/playerManagement/tag/attachTag.service'
import { CreateTagService } from '@src/services/playerManagement/tag/createTags.service'
import { DeleteTagService } from '@src/services/playerManagement/tag/deleteTag.service'
import { GetTagsService } from '@src/services/playerManagement/tag/getTags.service'
import { RemoveTagService } from '@src/services/playerManagement/tag/removeTag.service'
import { UpdateTagService } from '@src/services/playerManagement/tag/updateTag.service'

export class TagController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getTags (req, res, next) {
    try {
      const result = await GetTagsService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async createTag (req, res, next) {
    try {
      const result = await CreateTagService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async deleteTag (req, res, next) {
    try {
      const result = await DeleteTagService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async attachTagToPlayer (req, res, next) {
    try {
      const result = await AttachTagService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async removeTagFromPlayer (req, res, next) {
    try {
      const result = await RemoveTagService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  * @param {import('express').NextFunction} next
  */
  static async updateTag (req, res, next) {
    try {
      const result = await UpdateTagService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
