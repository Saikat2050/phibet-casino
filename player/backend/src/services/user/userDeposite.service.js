import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { CreateLedgerService } from '@src/services/ledger/createLedger.service'
import { LEDGER_PURPOSE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    walletId: { type: 'number' },
    userId: { type: 'number' },
    amount: { type: 'number' }
  },
  required: ['walletId', 'amount']
})

export class DepositService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const result = await CreateLedgerService.execute({
        userId: this.args.userId,
        amount: this.args.amount,
        walletId: this.args.walletId,
        purpose: LEDGER_PURPOSE.PURCHASE
      }, this.context)
      if (_.size(result.errors)) return this.mergeErrors(result.errors)

      const tx = await this.context.sequelize.models.transaction.create({
        userId: this.args.userId,
        ledgerId: result.result.id,
        status: TRANSACTION_STATUS.COMPLETED
      }, { transaction: this.context.sequelizeTransaction })

      return tx
    } catch (error) {
      throw new APIError(error)
    }
  }
}
