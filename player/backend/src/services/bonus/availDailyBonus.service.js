import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'
import { LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'
import { sequelize } from '@src/database/models'
import { CreateLedgerService } from '../ledger/createLedger.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class AvailDailyBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userId = this.args.userId
      const transaction = this.context.sequelizeTransaction

      const user = await this.context.sequelize.models.user.findOne({ where: { id: userId } })
      if (!user.isProfile) return this.addError('UpdateProfileDataToClaimDailyBonusErrorType')

      const dailyBonus = await this.context.sequelize.models.bonus.findOne({
        attributes: ['id', 'claimedCount', 'moreDetails'],
        where: {
          bonusType: BONUS_TYPES.DAILY_BONUS,
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
      if (!dailyBonus) {
        return this.addError('InvalidBonusIdErrorType')
      }
      async function getClaimedDailyBonusForLast24Hrs (userId, bonusId) {
        try {
          const [hasClaimedDailyBonusForLast24Hrs] = await sequelize.query(
            ` SELECT *
              FROM user_bonus
              WHERE user_id = ${userId}
                AND bonus_id = ${bonusId}
                AND claimed_at >= NOW() - INTERVAL '24 HOURS'
              ORDER BY claimed_at DESC
              LIMIT 1;
            `
          )
          return hasClaimedDailyBonusForLast24Hrs || 0
        } catch (error) {
          throw new APIError(error)
        }
      }
      const hasClaimedDailyBonusForLast24Hrs = await getClaimedDailyBonusForLast24Hrs(userId, dailyBonus.id)
      if (hasClaimedDailyBonusForLast24Hrs.length > 0) {
        return this.addError('BonusClaimErrorType')
      }

      const txn = await this.context.sequelize.models.transaction.create({
        userId,
        status: TRANSACTION_STATUS.COMPLETED,
        paymentId: uuid()
      }, { transaction })

      let transactionDetails
      for (const bonusCurrency of dailyBonus.bonusCurrencies) {
        const amount = bonusCurrency.amount
        const wallet = await this.context.sequelize.models.wallet.findOne({
          where: { userId, currencyId: bonusCurrency.currencyId },
          include: {
            model: this.context.sequelize.models.currency,
            where: { code: bonusCurrency.currency.code }
          },
          transaction
        })
        if (!wallet) {
          throw new APIError('InvalidWalletIdErrorType')
        }

        transactionDetails = await CreateLedgerService.execute({
          amount,
          walletId: wallet.id,
          userId,
          purpose: LEDGER_PURPOSE.DAILY_BONUS,
          transactionId: txn.id,
          currencyId: wallet.currencyId,
          transactionType: LEDGER_TRANSACTION_TYPE.STANDARD
        }, this.context)

        if (_.size(transactionDetails.errors)) return this.mergeErrors(transactionDetails.errors)
        // Save updated wallet balance
        await wallet.save({ transaction })
      }
      await this.context.sequelize.models.userBonus.create({
        bonusId: dailyBonus.id,
        userId,
        transactionId: transactionDetails.result.id,
        status: USER_BONUS_STATUS_VALUES.CLAIMED,
        claimedAt: new Date()
      }, { transaction })

      await dailyBonus.set({ claimedCount: dailyBonus.claimedCount + 1 }).save({ transaction })

      return { status: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
