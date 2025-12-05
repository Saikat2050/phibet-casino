import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'
import { LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'
import { CreateLedgerService } from '../ledger/createLedger.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class AvailJoiningBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const userId = this.args.userId
      const transaction = this.context.sequelizeTransaction

      const user = await this.context.sequelize.models.user.findOne({ where: { id: userId } })
      const isJoiningBonusClaimed = await this.context.sequelize.models.ledger.findOne({
        where: { purpose: LEDGER_PURPOSE.WELCOME_BONUS },
        include: {
          model: this.context.models.transaction,
          as: 'transactionLedger',
          where: { userId: this.args.userId },
          required: true
        }
      })
      if (isJoiningBonusClaimed) return this.addError('JoiningBonusAlreadyClaimedErrorType')
      // if (!user.isProfile) return this.addError('UpdateProfileDataToClaimDailyBonusErrorType')

      const joiningBonus = await this.context.sequelize.models.bonus.findOne({
        attributes: ['id', 'claimedCount', 'moreDetails'],
        where: {
          bonusType: BONUS_TYPES.WELCOME,
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

      const txn = await this.context.sequelize.models.transaction.create({
        userId,
        status: TRANSACTION_STATUS.COMPLETED,
        paymentId: uuid()
      }, { transaction })

      let transactionDetails

      for (const bonusCurrency of joiningBonus.bonusCurrencies) {
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
          purpose: LEDGER_PURPOSE.WELCOME_BONUS,
          transactionId: txn.id,
          currencyId: wallet.currencyId,
          transactionType: LEDGER_TRANSACTION_TYPE.STANDARD
        }, this.context)

        if (_.size(transactionDetails.errors)) return this.mergeErrors(transactionDetails.errors)
        // Save updated wallet balance
        await wallet.save({ transaction })
      }

      let userJoiningBonus = await this.context.sequelize.models.userBonus.findOne({
        where: { bonusId: joiningBonus.id, userId },
        transaction
      })

      if (!userJoiningBonus) {
        // Create new userBonus record if it doesn't exist
        userJoiningBonus = await this.context.sequelize.models.userBonus.create({
          bonusId: joiningBonus.id,
          userId,
          status: USER_BONUS_STATUS_VALUES.CLAIMED,
          claimedAt: new Date()
        }, { transaction })
      } else {
        // Update existing userBonus record
        userJoiningBonus.status = USER_BONUS_STATUS_VALUES.CLAIMED
        userJoiningBonus.claimedAt = new Date()
        await userJoiningBonus.save({ transaction })
      }
      await joiningBonus.set({ claimedCount: joiningBonus.claimedCount + 1 }).save({ transaction })

      return { status: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
