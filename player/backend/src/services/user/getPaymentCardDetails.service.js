import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    cardId: { type: 'string' }
  },
  required: ['userId', 'cardId']
})

export class GetPaymentCardDetailsService extends ServiceBase {
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

      const paymentCard = await this.context.sequelize.models.userPaymentCard.findOne({
        where: {
          id: this.args.cardId,
          userId: this.args.userId,
          isActive: true,
          deletedAt: null
        },
        transaction
      })

      if (!paymentCard) {
        return this.addError('PaymentCardNotFoundErrorType')
      }

      const decryptedCardNumber = this.decryptedCardNumber(paymentCard.cardNumber)

      return {
        id: paymentCard.id,
        cardType: paymentCard.cardType,
        cardHolderName: paymentCard.cardHolderName,
        cardNumber: decryptedCardNumber,
        maskedCardNumber: this.maskedCardNumber(decryptedCardNumber),
        expiryMonth: paymentCard.expiryMonth,
        expiryYear: paymentCard.expiryYear,
        isDefault: paymentCard.isDefault,
        isActive: paymentCard.isActive,
        isCreditCard: paymentCard.isCreditCard,
        moreDetails: paymentCard.moreDetails,
        createdAt: paymentCard.createdAt,
        updatedAt: paymentCard.updatedAt
      }
    } catch (error) {
      throw new APIError(error)
    }
  }


}
