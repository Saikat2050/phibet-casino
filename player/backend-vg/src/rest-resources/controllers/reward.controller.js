import GetRafflePromotion from '../../services/reward/getRafflePromotion'
import GetRaffleDetail from '../../services/reward/getRaffleDetail'
import { sendResponse } from '../../utils/response.helpers'
import GetTierDetail from '../../services/reward/getTierDetail'
import UserRaffleTicketService from '../../services/reward/getuserRaffleTicket.service'
import { GetWelcomeBonusDetail } from '../../services/reward'
export default class RewardController {
  static async getTierDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetTierDetail.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getWelcomeBonusDetails (req, res, next) {
    try {
      const { result, successful, errors } = await GetWelcomeBonusDetail.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRafflePromotion (req, res, next) {
    try {
      const { result, successful, errors } = await GetRafflePromotion.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getRaffleDetail (req, res, next) {
    try {
      const { result, successful, errors } = await GetRaffleDetail.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }

  static async getUserRaffleTickets (req, res, next) {
    try {
      const { result, successful, errors } = await UserRaffleTicketService.execute({ ...req.query, ...req.body }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
