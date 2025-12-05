import { decorateResponse } from '@src/helpers/response.helpers'
import { CreateDisputeMessageService } from '@src/services/crm/disputeManagement/createDisputeMessage.service'
import { CreateUserDisputesService } from '@src/services/crm/disputeManagement/createUserDisputes.service'
import { GetThreadDetailsService } from '@src/services/crm/disputeManagement/getThreadDetails.service'
import { GetUserDisputesService } from '@src/services/crm/disputeManagement/getUserDisputes.service'
import { UpdateDisputeStatusService } from '@src/services/crm/disputeManagement/updateDisputeStatus.service'
import { UpdateMessageReadService } from '@src/services/crm/disputeManagement/updateMessageRead.service'

export class UserDisputeController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async raiseTicket (req, res, next) {
    try {
      const result = await CreateUserDisputesService.execute({ ...req.body, userId: req.authenticated.userId, file: req.file }, req.context)
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
  static async getTicket (req, res, next) {
    try {
      const result = await GetUserDisputesService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
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
  static async createMessage (req, res, next) {
    try {
      const result = await CreateDisputeMessageService.execute({ ...req.body, userId: req.authenticated.userId, file: req.file }, req.context)
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
  static async getTicketDetails (req, res, next) {
    try {
      const result = await GetThreadDetailsService.execute({ ...req.query, userId: req.authenticated.userId }, req.context)
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
  static async updateMessageRead (req, res, next) {
    try {
      const result = await UpdateMessageReadService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
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
  static async updateStatus (req, res, next) {
    try {
      const result = await UpdateDisputeStatusService.execute({ ...req.body, userId: req.authenticated.userId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
