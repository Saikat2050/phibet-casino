import { APIError } from '@src/errors/api.error'
import { errorTypes } from '@src/utils/constants/error.constants'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'
import { AMOE_STATUS, LEDGER_PURPOSE, LEDGER_TRANSACTION_TYPE, SWEEPS_COINS, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import { CreateLedgerService } from '../ledger/createLedger.service'
import { Op } from 'sequelize'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    adminUserId: { type: 'string' },
    status: { enum: [AMOE_STATUS.APPROVED, AMOE_STATUS.REJECTED] }
  }
})

export class ManageAmoEntriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id, status, adminUserId } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      // Fetch amoEntry and check status
      const amoEntry = await this.context.sequelize.models.amoEntry.findOne({ where: { id }, transaction })
      if (amoEntry.status !== AMOE_STATUS.PENDING) {
        return this.addError(errorTypes.AmoEntryAlreadySettleErrorType.name)
      }

      // Update status and handle approved status logic
      amoEntry.status = status
      await amoEntry.save({ transaction })

      if (status === AMOE_STATUS.APPROVED) {
        const postalCodeBonus = await this.context.sequelize.models.bonus.findOne({
          where: {
            bonusType: BONUS_TYPES.AMOE_CODE,
            isActive: true
          },
          include: {
            model: this.context.sequelize.models.bonusCurrency,
            include: {
              model: this.context.models.currency,
              where: { code: { [Op.in]: [SWEEPS_COINS.GC, SWEEPS_COINS.BSC] } },
              required: true
            }
          }
        })

        if (!postalCodeBonus) {
          return this.addError(errorTypes.PostalCodeInactiveErrorType.name)
        }

        const userId = amoEntry.userId

        // Create the transaction record
        const txn = await this.context.sequelize.models.transaction.create({
          userId,
          status: TRANSACTION_STATUS.COMPLETED,
          actioneeId: adminUserId
        }, { transaction })

        // add the coins in the users wallet
        for (const bonusCurrency of postalCodeBonus.bonusCurrencies) {
          const amount = bonusCurrency.amount

          // get the wallet
          const wallet = await this.context.sequelize.models.wallet.findOne({
            where: { userId, currencyId: bonusCurrency.currencyId },
            include: {
              model: this.context.sequelize.models.currency,
              where: { code: bonusCurrency.currency.code }
            },
            transaction
          })

          if (!wallet) return this.addError('InvalidWalletIdErrorType')

          // Create the ledger entry for this transaction
          const result = await CreateLedgerService.execute({
            amount,
            walletId: wallet.id,
            userId,
            purpose: LEDGER_PURPOSE.BONUS_CASHED,
            transactionId: txn.id,
            currencyId: wallet.currencyId,
            transactionType: LEDGER_TRANSACTION_TYPE.STANDARD
          }, this.context)

          if (_.size(result.errors)) return this.mergeErrors(result.errors)

          // Save updated wallet balance
          await wallet.save({ transaction })
        }

        // create a bonus record
        await this.context.sequelize.models.userBonus.create({
          bonusId: postalCodeBonus.id,
          userId,
          transactionId: txn.id,
          status: USER_BONUS_STATUS_VALUES.CLAIMED,
          claimedAt: new Date()
        }, { transaction })

        // set the cout
        await postalCodeBonus.set({ claimedCount: postalCodeBonus.claimedCount + 1 }).save({ transaction })
      }

      return { status: 'success' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
