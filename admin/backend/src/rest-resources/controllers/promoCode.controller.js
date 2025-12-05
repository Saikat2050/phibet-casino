import { decorateResponse } from '@src/helpers/response.helpers'
import { CreatePromoCodeService } from '@src/services/promoCode/createPromoCode.service'
import { DeletePromoCodeService } from '@src/services/promoCode/deletePromoCodeService'
import { GetPromoCodeDetails } from '@src/services/promoCode/getPromoCodeDetails.service'
import { PromoCodeAppliedDetailsService } from '@src/services/promoCode/promoCodeAppliedDetails.service'
import { UpdatePromoCodeService } from '@src/services/promoCode/updatePromoCode.service'

export class PromoCodeController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async createPromoCodes (req, res, next) {
    PromoCodeController.#handleRequest(CreatePromoCodeService, req, res, next)
  }

  static async updatePromoCodes (req, res, next) {
    PromoCodeController.#handleRequest(UpdatePromoCodeService, req, res, next)
  }

  static async deletePromoCode (req, res, next) {
    PromoCodeController.#handleRequest(DeletePromoCodeService, req, res, next)
  }

  static async getPromoCodeDetails (req, res, next) {
    PromoCodeController.#handleRequest(GetPromoCodeDetails, req, res, next)
  }

  static async promoCodeAppliedDetails (req, res, next) {
    PromoCodeController.#handleRequest(PromoCodeAppliedDetailsService, req, res, next)
  }

  // 🔒 Private helper to reduce duplicate try-catch blocks
  static async #handleRequest (Service, req, res, next) {
    try {
        console.log("promocode running right now")
      const payload = { ...req.query, ...req.body }
      const result = await Service.execute(payload, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
