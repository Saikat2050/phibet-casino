import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateEmailTemplatesService } from '@src/services/emailTemplates/createEmailTemplate.service'
import { DeleteEmailTemplatesService } from '@src/services/emailTemplates/deleteEmailTemplate.service'
import { GetEmailTemplateService } from '@src/services/emailTemplates/getEmailTemplate.service'
import { GetEmailTemplatesService } from '@src/services/emailTemplates/getEmailTemplates.service'
import { SetDefaultEmailTemplateService } from '@src/services/emailTemplates/setDefaultEmailTemplate.service'
import { UpdateEmailTemplatesService } from '@src/services/emailTemplates/updateEmailTemplate.service'

export class EmailTemplateController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getEmailTemplates (req, res, next) {
    try {
      const result = await GetEmailTemplatesService.execute(req.query, req.context)
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
  static async getEmailTemplate (req, res, next) {
    try {
      const result = await GetEmailTemplateService.execute(req.query, req.context)
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
  static async createEmailTemplate (req, res, next) {
    try {
      const result = await CreateEmailTemplatesService.execute(req.body, req.context)
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
  static async updateEmailTemplate (req, res, next) {
    try {
      const result = await UpdateEmailTemplatesService.execute(req.body, req.context)
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
  static async setDefaultEmailTemplate (req, res, next) {
    try {
      const result = await SetDefaultEmailTemplateService.execute(req.body, req.context)
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
  static async deleteEmailTemplate (req, res, next) {
    try {
      const result = await DeleteEmailTemplatesService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
