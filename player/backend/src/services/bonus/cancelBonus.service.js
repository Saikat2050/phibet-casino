import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userBonusId: { type: 'string' },
    userId: { type: 'string' }
  },
  required: ['userBonusId', 'userId']
})

export class CancelBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userBonusId = this.args.userBonusId
    const userId = this.args.userId
    const transaction = this.context.sequelizeTransaction

    try {
      const user = await this.context.models.user.findOne({
        where: { id: userId },
        include: {
          model: this.context.sequelize.models.wallet,
          include: {
            model: this.context.models.currency,
            where: { code: 'BONUS' }
          }
        },
        transaction
      })

      if (!user) return this.addError('UserDoesNotExistsErrorType')

      const userBonus = await this.context.models.userBonus.findOne({
        where: { userId, id: userBonusId },
        include: [{
          model: this.context.sequelize.models.bonus,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }],
        transaction
      })

      if (!userBonus) return this.addError('BonusNotFoundErrorType')
      if (userBonus.status === USER_BONUS_STATUS_VALUES.CANCELLED) return this.addError('BonusCancelledExistErrorType')

      // const wallet = user.wallets[0]

      if (userBonus.bonus.bonusType === BONUS_TYPES.DEPOSIT) {
        // await CreateTransactionService.execute({
        //   userId: 4,
        //   amount: userBonus.transaction.ledger.amount,
        //   walletId: wallet.id,
        //   purpose: LEDGER_PURPOSE.BONUS_WITHDRAW
        // }, this.context)
      }

      userBonus.status = USER_BONUS_STATUS_VALUES.CANCELLED
      await userBonus.save({ transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
