import { PAYMENT_CARD_TYPES } from '@src/utils/constants/public.constants.utils'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { encryptCardNumber,decryptCardNumber, maskCardNumber } from '@src/helpers/common.helper'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    cardId: { type: 'string' },
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
  required: ['userId', 'cardId']
})

export class UpdatePaymentCardService extends ServiceBase {
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

      const existingCard = await this.context.sequelize.models.userPaymentCard.findOne({
        where: {
          id: this.args.cardId,
          userId: this.args.userId,
          isActive: true
        },
        transaction
      })

      if (!existingCard) {
        return this.addError('PaymentCardNotFoundErrorType')
      }

      // Check if new card number already exists (if card number is being updated)
      if (this.args.cardNumber && this.args.cardNumber !== decryptCardNumber(existingCard.cardNumber)) {
        const duplicateCard = await this.context.sequelize.models.userPaymentCard.findOne({
          where: {
            userId: this.args.userId,
            cardNumber: encryptCardNumber(this.args.cardNumber),
            id: { [this.context.sequelize.Sequelize.Op.ne]: this.args.cardId }
          },
          transaction
        })

        if (duplicateCard) {
          return this.addError('CardAlreadyExistsErrorType')
        }
      }

      // If setting as default, unset other default cards
      if (this.args.isDefault) {
        await this.context.sequelize.models.userPaymentCard.update(
          { isDefault: false },
          {
            where: {
              userId: this.args.userId,
              id: { [this.context.sequelize.Sequelize.Op.ne]: this.args.cardId }
            },
            transaction
          }
        )
      }

      // Prepare update data
      const updateData = {}
      if (this.args.cardNumber) updateData.cardNumber = encryptCardNumber(this.args.cardNumber)
      if (this.args.expiryMonth) updateData.expiryMonth = this.args.expiryMonth
      if (this.args.expiryYear) updateData.expiryYear = this.args.expiryYear
      if (this.args.cardHolderName) updateData.cardHolderName = this.args.cardHolderName
      if (this.args.cardType) updateData.cardType = this.args.cardType
      if (this.args.isDefault !== undefined) updateData.isDefault = this.args.isDefault
      if (this.args.isCreditCard !== undefined) updateData.isCreditCard = this.args.isCreditCard
      if (this.args.moreDetails) updateData.moreDetails = this.args.moreDetails

      // Update the payment card
      await this.context.sequelize.models.userPaymentCard.update(
        updateData,
        {
          where: { id: this.args.cardId, userId: this.args.userId },
          transaction
        }
      )

      // Fetch updated card
      const updatedCard = await this.context.sequelize.models.userPaymentCard.findOne({
        where: { id: this.args.cardId, userId: this.args.userId },
        transaction
      })

      const cardNumber = this.args.cardNumber || decryptCardNumber(updatedCard.cardNumber)

      return {
        id: updatedCard.id,
        cardType: updatedCard.cardType,
        cardHolderName: updatedCard.cardHolderName,
        maskedCardNumber: maskCardNumber(cardNumber),
        expiryMonth: updatedCard.expiryMonth,
        expiryYear: updatedCard.expiryYear,
        isDefault: updatedCard.isDefault,
        isActive: updatedCard.isActive,
        isCreditCard: updatedCard.isCreditCard,
        moreDetails: updatedCard.moreDetails,
        createdAt: updatedCard.createdAt,
        updatedAt: updatedCard.updatedAt
      }
    } catch (error) {
      throw new APIError(error)
    }
  }

}
