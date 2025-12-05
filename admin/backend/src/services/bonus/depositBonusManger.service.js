import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { ServiceBase } from '@src/libs/serviceBase'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES, WAGERING_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { AMOUNT_TYPES, LEDGER_PURPOSE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import { CreateLedgerService } from '../ledger/createLedger.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    amount: { type: 'number' },
    walletId: { type: 'string' },
    currencyId: { type: 'string' },
    transactionId: { type: 'string' }
  },
  required: ['userId', 'amount', 'currencyId', 'transactionId']
})

export class DepositBonusManagerService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userId = this.args.userId
      const amount = this.args.amount
      const currencyId = this.args.currencyId
      const walletId = this.args.walletId
      const transaction = this.context.sequelizeTransaction

      const userBonus = await this.context.sequelize.models.userBonus.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { userId, currencyId, status: USER_BONUS_STATUS_VALUES.IN_PROCESS },
        include: {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.bonus,
          where: { bonusType: BONUS_TYPES.DEPOSIT },
          include: [{
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { currencyId },
            model: this.context.sequelize.models.bonusCurrency
          },
          {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.sequelize.models.wageringTemplate
          },
          {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.sequelize.models.depositBonus,
            as: 'depositBonus'
          }]
        },
        transaction
      })

      if (!userBonus) return
      if (amount < userBonus.bonus.bonusCurrencies[0]?.minDepositAmount) return

      const depositBonus = userBonus.bonus.depositBonus
      const bonusAmount = NumberPrecision.round(NumberPrecision.times(amount, depositBonus.percentage) / 100)
      const wageringTemplate = userBonus.bonus.wageringTemplate

      const amountToWager = (wageringTemplate.wageringRequirementType === WAGERING_TYPES.BONUS)
        ? NumberPrecision.times(bonusAmount, wageringTemplate.wageringMultiplier)
        : NumberPrecision.times(bonusAmount + amount, wageringTemplate.wageringMultiplier)

      userBonus.amountToWager = NumberPrecision.round(amountToWager)
      userBonus.status = USER_BONUS_STATUS_VALUES.ACTIVE
      userBonus.transactionId = this.args.transactionId

      const result = await CreateLedgerService.execute({
        userId,
        amount: bonusAmount,
        walletId,
        purpose: LEDGER_PURPOSE.BONUS_DEPOSIT,
        amountType: AMOUNT_TYPES.BONUS
      }, this.context)

      await this.context.sequelize.models.transaction.create({
        userId,
        ledgerId: result.result.id,
        status: TRANSACTION_STATUS.COMPLETED
      }, { transaction })

      await userBonus.save({ transaction })

      return { amountToWager, bonusAmount }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
