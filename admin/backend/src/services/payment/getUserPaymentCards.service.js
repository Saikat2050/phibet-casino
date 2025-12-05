import { APIError } from '@src/errors/api.error'
import { alignDatabaseDateFilter, decryptCardNumber, maskCardNumber } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { PAYMENT_CARD_TYPES } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    userId: { type: 'string' },
    isCreditCard: { type: 'boolean' },
    cardType: { enum: Object.values(PAYMENT_CARD_TYPES) },
    isActive: { type: 'boolean' },
    isDefault: { type: 'boolean' },
    searchString: { type: 'string' },
    pageNo: { type: 'number', minimum: 1, default: 1 },
    limit: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'userId', 'cardHolderName', 'cardType', 'createdAt'], default: 'id' }
  }
})

export class GetUserPaymentCardsService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    const userId = this.args.userId
    const isCreditCard = this.args.isCreditCard
    const cardType = this.args.cardType
    const isActive = this.args.isActive
    const isDefault = this.args.isDefault
    const searchString = this.args.searchString
    const pageNo = this.args.pageNo
    const limit = this.args.limit
    const fromDate = this.args.fromDate
    const toDate = this.args.toDate

    try {
      const where = {}

      if (userId) where.userId = userId
      if (_.isBoolean(isCreditCard)) where.isCreditCard = isCreditCard
      if (cardType) where.cardType = cardType
      if (_.isBoolean(isActive)) where.isActive = isActive
      if (_.isBoolean(isDefault)) where.isDefault = isDefault

      if (searchString) {
        const finalSearchString = `%${searchString}%`
        where[Op.or] = [
          { cardHolderName: { [Op.iLike]: finalSearchString } },
          { cardType: { [Op.iLike]: finalSearchString } }
        ]
      }

      if (fromDate || toDate) {
        const dateFilter = alignDatabaseDateFilter(fromDate, toDate)
        where.createdAt = dateFilter
      }

      const include = [{
        attributes: ['id', 'username', 'firstName', 'lastName', 'email'],
        model: this.context.sequelize.models.user
      }]

      const userPaymentCards = await this.context.sequelize.models.userPaymentCard.findAndCountAll({
        where,
        include,
        limit,
        offset: (pageNo - 1) * limit,
        order: [[this.args.orderBy, this.args.order]]
      })

      const processedCards = userPaymentCards.rows.map(card => {
        const cardData = card.toJSON()
        delete cardData.cardNumber
        cardData.maskedCardNumber = maskCardNumber(decryptCardNumber(card.cardNumber))
        return cardData
      })

      return { 
        userPaymentCards: processedCards, 
        pageNo, 
        totalPages: Math.ceil(userPaymentCards.count / limit),
        totalCount: userPaymentCards.count
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}