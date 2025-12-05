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

export class AvailBirthdayBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {

      const userId = this.args.userId
      const transaction = this.context.sequelizeTransaction
      // Check if the user's first deposit is successful (at least one completed purchase transaction)
      // const firstDeposit = await this.context.sequelize.models.ledger.findOne({
      //   include: [
      //     {
      //       model: this.context.sequelize.models.transaction,
      //       as: 'transactionLedger',
      //       where: { userId, status: TRANSACTION_STATUS.COMPLETED },
      //       attributes: []
      //     }
      //   ],
      //   where: {
      //     purpose: {
      //       [Op.in]: [
      //         LEDGER_PURPOSE.PURCHASE_GC_COIN,
      //         LEDGER_PURPOSE.PURCHASE_SC_COIN,
      //         LEDGER_PURPOSE.PURCHASE
      //         // LEDGER_PURPOSE.PURCHASE_GC_BONUS,
      //         // LEDGER_PURPOSE.PURCHASE_SC_BONUS
      //       ]
      //     }
      //   },
      //   transaction
      // })
      // if (!firstDeposit) {
      //   return this.addError('FirstDepositNotCompletedErrorType')
      // }
      const birthdayBonus = await this.context.sequelize.models.bonus.findOne({
        attributes: ['id', 'claimedCount', 'moreDetails', 'daysToClear'],
        where: {
          bonusType: BONUS_TYPES.BIRTHDAY,
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

      if (!birthdayBonus) {
        return this.addError('InvalidBonusIdErrorType')
      }

      const user = await this.context.sequelize.models.user.findOne({
        where: { id: userId },
        attributes: ['dateOfBirth']
      })
      const today = new Date()
      const dob = new Date(user.dateOfBirth)

      const thisYearBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate())

      const daysDifference = Math.abs((today - thisYearBirthday) / (1000 * 60 * 60 * 24))

      const daysToClear = birthdayBonus.daysToClear || 0
      if (daysDifference > daysToClear) {
        return this.addError('NotWithinBirthdayClaimWindowErrorType')
      }

      const claimedBonus = await this.context.sequelize.models.userBonus.findOne({
        where: {
          bonusId: birthdayBonus.id,
          userId,
          claimedAt: {
            [Op.gte]: new Date(today.setFullYear(today.getFullYear() - 1))
          }
        },
        transaction
      })

      if (claimedBonus) {
        return this.addError('BonusAlreadyClaimedErrorType')
      }

      const txn = await this.context.sequelize.models.transaction.create({
        userId,
        status: TRANSACTION_STATUS.COMPLETED,
        paymentId: uuid()
      }, { transaction })

      let transactionDetails
      for (const bonusCurrency of birthdayBonus.bonusCurrencies) {
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
          purpose: LEDGER_PURPOSE.BIRTHDAY_BONUS,
          transactionId: txn.id,
          currencyId: wallet.currencyId,
          transactionType: LEDGER_TRANSACTION_TYPE.STANDARD
        }, this.context)

        if (_.size(transactionDetails.errors)) return this.mergeErrors(transactionDetails.errors)
        await wallet.save({ transaction })
      }
      const userBirthdayBonus = await this.context.sequelize.models.userBonus.create({
        bonusId: birthdayBonus.id,
        userId,
        status: USER_BONUS_STATUS_VALUES.CLAIMED,
        claimedAt: new Date()
      }, { transaction })

      await birthdayBonus.set({ claimedCount: birthdayBonus.claimedCount + 1 }).save({ transaction })
      return { status: true, userBirthdayBonus }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
