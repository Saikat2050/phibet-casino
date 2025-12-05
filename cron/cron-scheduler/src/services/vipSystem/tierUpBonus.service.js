import { sequelize } from '@src/database'
import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'
import { v4 as uuid } from 'uuid'
import { CURRENCY_CODE, LEDGER_PURPOSE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { CreateLedgerService } from '@src/services/common/createLedger.service'
import { LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/payment.constants'
export class TierUpBonusService extends ServiceBase {
  async run () {
    try {
      const transaction = this?.args?.seqTransaction || await sequelize.transaction()
      const { userId, gcCoins, scCoins } = this.args
      const walletDetails = await sequelize.models.wallet.findAll({
        where: { userId: userId },
        attributes: ['id'],
        include: [
          {
            model: sequelize.models.currency,
            where: { code: [CURRENCY_CODE.GC, CURRENCY_CODE.BSC] },
            attributes: ['id', 'code']
          }
        ],
        transaction
      })

      if (!walletDetails || walletDetails.length === 0) {
        if (!this?.args?.seqTransaction) await transaction.commit()
        return
      }

      const walletCurrencyMap = {}
      walletDetails.forEach((wallet) => {
        const currency = wallet.currency
        if (currency && currency.code) walletCurrencyMap[currency.code] = { walletId: wallet.id, currencyId: currency.id }
      })

      const gcDetails = walletCurrencyMap[CURRENCY_CODE.GC]
      const bscDetails = walletCurrencyMap[CURRENCY_CODE.BSC]

      if (!gcDetails || !bscDetails) {
        if (!this?.args?.seqTransaction) await transaction.commit()
        return
      }

      const txn = await sequelize.models.transaction.create({
        userId,
        status: TRANSACTION_STATUS.COMPLETED,
        paymentId: uuid()
      }, { transaction })

      const transactions = []
      if (gcCoins && gcDetails.currencyId) {
        transactions.push(
          await CreateLedgerService.execute({
            amount: gcCoins,
            walletId: gcDetails.walletId,
            userId,
            purpose: LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS,
            transactionId: txn.id,
            currencyId: gcDetails.currencyId,
            transactionType: LEDGER_TRANSACTION_TYPE.STANDARD,
            seqTransaction: transaction
          })
        )
      }
      if (scCoins && bscDetails.currencyId) {
        transactions.push(
          await CreateLedgerService.execute({
            amount: scCoins,
            walletId: bscDetails.walletId,
            userId,
            purpose: LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS,
            transactionId: txn.id,
            currencyId: bscDetails.currencyId,
            transactionType: LEDGER_TRANSACTION_TYPE.STANDARD,
            seqTransaction: transaction
          })
        )
      }

      const transactionResults = await Promise.all(transactions)
      const errors = transactionResults
        .filter(result => result && _.size(result.errors))
        .map(result => result.errors)

      if (errors.length) {
        await transaction.rollback()
        return this.mergeErrors(errors)
      }

      if (!this?.args?.seqTransaction) await transaction.commit()

      return { success: true, message: 'Tier up bonus processed successfully', data: null }
    } catch (error) {
      Logger.error('Tier up bonus service', { message: 'Tier up bonus service', exception: error })
      return { success: false, message: 'Error in Tier up bonus service', data: null, error }
    }
  }
}
