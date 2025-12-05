import { Logger } from '@src/libs/logger'
import ServiceBase from '@src/libs/serviceBase'
import { v4 as uuid } from 'uuid'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { CreateTransactionService } from '../transaction/createTransaction.service'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gcCoins: { type: ['string', 'number'] },
    scCoins: { type: ['string', 'number'] },
    gcDetails: { type: 'object' },
    bscDetails: { type: 'object' }
  },
  required: ['userId', 'purpose', 'amount', 'code', 'gcDetails', 'bscDetails']
})

export class TierUpBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { userId, gcCoins, scCoins, gcDetails, bscDetails } = this.args

      if (!gcDetails || !bscDetails) return { success: true }

      const transactions = []
      if (gcCoins && gcDetails.currencyId) {
        transactions.push(
          CreateTransactionService.execute(
            {
              userId,
              paymentId: uuid(),
              amount: gcCoins,
              wallet: gcDetails,
              purpose: LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS,
              currencyId: gcDetails.currencyId
            }, this.context)
        )
      }
      if (scCoins && bscDetails.currencyId) {
        transactions.push(
          CreateTransactionService.execute(
            {
              userId,
              paymentId: uuid(),
              amount: scCoins,
              wallet: bscDetails,
              purpose: LEDGER_PURPOSE.VIP_TIER_TIER_UP_BONUS,
              currencyId: bscDetails.currencyId
            }, this.context)
        )
      }

      const transactionResults = await Promise.all(transactions)
      const errors = transactionResults
        .filter(result => result && _.size(result.errors))
        .map(result => result.errors)

      if (errors.length) return { success: false }

      return { success: true, message: 'Tier up bonus processed successfully', data: null }
    } catch (error) {
      Logger.error('Tier up bonus service', { message: 'Tier up bonus service', exception: error })
      return { success: false, message: 'Error in Tier up bonus service', data: null, error }
    }
  }
}
