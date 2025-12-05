import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'
import { LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { Op } from 'sequelize'
import { CreateLedgerService } from '@src/services/ledger/createLedger.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    // email: { type: 'string' },
    // username: { type: 'string' },
    // language: { type: 'string' },
    adminUserId: { type: 'string' }
  },
  required: ['userId', 'adminUserId']
})

export class JoiningBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userId = this.args.userId
      // const email = this.args.email
      // const username = this.args.username
      // const language = this.args.language
      const adminUserId = this.args.adminUserId
      const purpose = LEDGER_PURPOSE.JOINING_BONUS
      const transaction = this.context.sequelizeTransaction
      const walletModel = this.context.sequelize.models.wallet

      const joiningBonus = await this.context.sequelize.models.bonus.findOne({
        attributes: ['id', 'claimedCount', 'moreDetails'],
        where: {
          bonusType: BONUS_TYPES.JOINING,
          isActive: true
        },
        include: {
          model: this.context.models.bonusCurrency,
          include: {
            model: this.context.models.currency,
            where: { code: { [Op.in]: ['GC', 'BSC'] } },
            required: true
          }
        },
        transaction
      })
      if (!joiningBonus) {
        return this.addError('InvalidBonusIdErrorType')
      }
      const tx = await this.context.sequelize.models.transaction.create({
        userId,
        actioneeId: adminUserId,
        paymentId: uuid(),
        status: TRANSACTION_STATUS.COMPLETED
      }, { transaction })

      for (const bonusCurrency of joiningBonus.bonusCurrencies) {
        const amount = bonusCurrency?.amount

        const wallet = await walletModel.findOne({
          where: { userId, currencyId: bonusCurrency.currencyId },
          include: {
            model: this.context.sequelize.models.currency,
            where: { code: bonusCurrency?.currency?.code }
          },
          transaction
        })

        if (!wallet) return this.addError('InvalidWalletIdErrorType')

        const result = await CreateLedgerService.execute({
          userId,
          amount,
          walletId: wallet.id,
          purpose,
          transactionId: tx.id,
          currencyId: wallet.currencyId,
          transactionType: LEDGER_TRANSACTION_TYPE.STANDARD
        }, this.context)

        if (_.size(result.errors)) return this.mergeErrors(result.errors)

        tx.ledger = result.result

        await wallet.save({ transaction })
      }
      const userJoiningBonus = await this.context.sequelize.models.userBonus.findOne({
        where: { bonusId: joiningBonus.id, userId },
        transaction
      })
      userJoiningBonus.status = USER_BONUS_STATUS_VALUES.CLAIMED
      userJoiningBonus.claimedAt = new Date()
      userJoiningBonus.transactionId = tx.id
      await userJoiningBonus.save({ transaction })
      await joiningBonus.set({ claimedCount: joiningBonus.claimedCount + 1 }).save({ transaction })
      return { status: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
