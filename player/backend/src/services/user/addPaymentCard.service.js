import { PAYMENT_CARD_TYPES } from '@src/utils/constants/public.constants.utils'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { encryptCardNumber, maskCardNumber } from '@src/helpers/common.helper'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    cardNumber: {
      type: 'string',
    },
    expiryMonth: {
      type: 'integer',
      minimum: 1,
      maximum: 12
    },
    expiryYear: {
      type: 'integer',
      minimum: new Date().getFullYear()
    },
    cardHolderName: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    },
    cardType: {
      type: 'string',
      enum: Object.values(PAYMENT_CARD_TYPES)
    },
    isDefault: {
      type: 'boolean'
    },
    isCreditCard: {
      type: 'boolean'
    },
    moreDetails: {
      type: 'object'
    }
  },
  required: ['userId', 'cardNumber', 'expiryMonth', 'expiryYear', 'cardHolderName', 'cardType']
})

export class AddPaymentCardService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const transaction = this.context.sequelizeTransaction

      const user = await this.context.sequelize.models.user.findOne({
        attributes: ['id', 'emailVerified'],
        where: { id: this.args.userId },
        transaction
      })

      if (!user) {
        return this.addError('UserNotFoundErrorType')
      }

      // if (!user.emailVerified) {
      //   return this.addError('EmailNotVerifiedErrorType')
      // }

      const existingCard = await this.context.sequelize.models.userPaymentCard.findOne({
        where: {
          userId: this.args.userId,
          cardNumber: encryptCardNumber(this.args.cardNumber)
        },
        transaction
      })

      if (existingCard) {
        return this.addError('CardAlreadyExistsErrorType')
      }

      if (this.args.isDefault) {
        await this.context.sequelize.models.userPaymentCard.update(
          { isDefault: false },
          {
            where: { userId: this.args.userId },
            transaction
          }
        )
      }

      const paymentCard = await this.context.sequelize.models.userPaymentCard.create({
        userId: this.args.userId,
        cardNumber: encryptCardNumber(this.args.cardNumber),
        expiryMonth: this.args.expiryMonth,
        expiryYear: this.args.expiryYear,
        cardHolderName: this.args.cardHolderName,
        cardType: this.args.cardType,
        isDefault: this.args.isDefault || false,
        isCreditCard: this.args.isCreditCard !== undefined ? this.args.isCreditCard : true,
        moreDetails: this.args.moreDetails || {}
      }, { transaction })

      return {
        id: paymentCard.id,
        cardType: paymentCard.cardType,
        cardHolderName: paymentCard.cardHolderName,
        maskedCardNumber: maskCardNumber(this.args.cardNumber),
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
