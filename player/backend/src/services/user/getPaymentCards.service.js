import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { decryptCardNumber, maskCardNumber } from '@src/helpers/common.helper'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class GetPaymentCardsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const transaction = this.context.sequelizeTransaction

      const user = await this.context.sequelize.models.user.findOne({
        attributes: ['id'],
        where: { id: this.args.userId },
        transaction
      })

      if (!user) {
        return this.addError('UserNotFoundErrorType')
      }

      const paymentCards = await this.context.sequelize.models.userPaymentCard.findAll({
        where: {
          userId: this.args.userId,
          isActive: true,
          deletedAt: null
        },
        order: [['isDefault', 'DESC'], ['createdAt', 'DESC']],
        transaction
      })

      return paymentCards.map(card => ({
        id: card.id,
        cardType: card.cardType,
        cardHolderName: card.cardHolderName,
        maskedCardNumber: maskCardNumber(decryptCardNumber(card.cardNumber)),
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        isDefault: card.isDefault,
        isActive: card.isActive,
        isCreditCard: card.isCreditCard,
        moreDetails: card.moreDetails,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt
      }))
    } catch (error) {
      throw new APIError(error)
    }
  }

}
