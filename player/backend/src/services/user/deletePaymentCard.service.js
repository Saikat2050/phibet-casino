import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    cardId: { type: 'string' },
    userId: { type: 'string' }
  },
  required: ['cardId', 'userId']
})

export class DeletePaymentCardService extends ServiceBase {
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

      await paymentCard.update({
        isActive: false,
        deletedAt: new Date()
      }, { transaction })

      return {
        success: true,
        message: 'Payment card deleted successfully'
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
