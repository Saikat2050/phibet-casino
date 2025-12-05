import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { LEDGER_PURPOSE, SWEEPS_COINS, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { PaymentTransactionService } from '../transaction/paymentTransaction.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    coins: { type: 'number' },
    paymentProviderId: { type: 'string' },
    bankAccountId: { type: ['string', 'null'] },
    debitCardId: { type: ['string', 'null'] }
  },
  required: ['userId', 'coins']
})

export class RedeemCoinsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, coins, paymentProviderId, bankAccountId, debitCardId } = this.args

    try {
      const user = await this.context.sequelize.models.user.findOne({
        where: { id: userId },
        include: {
          model: this.context.sequelize.models.wallet,
          attributes: ['id'],
          include: { model: this.context.sequelize.models.currency, where: { code: SWEEPS_COINS.RSC }, attributes: [], required: true }
        },
        attributes: ['email', 'id']
      })

      if (user?.wallets[0]?.amount < 0) return this.addError('NotEnoughAmountErrorType')

      const providerDetails = await this.context.sequelize.models.paymentProvider.findOne({
        where: { id: paymentProviderId, withdrawAllowed: true },
        attributes: ['minWithdraw', 'maxWithdraw'],
        raw: true
      })
      if (!providerDetails) return this.addError('PaymentProviderNotExistErrorType')

      if (providerDetails?.minWithdraw && coins < providerDetails?.minWithdraw) return this.addError('MinimumRedeemAmountErrorType')
      if (providerDetails?.maxWithdraw && coins > providerDetails?.maxWithdraw) return this.addError('MaximumRedeemAmountErrorType')
      const redeemTransaction = await PaymentTransactionService.execute({
        amount: coins,
        moreDetails: { bankAccountId, debitCardId },
        userId: userId,
        paymentProviderId,
        walletId: user?.wallets[0]?.id,
        purpose: LEDGER_PURPOSE.REDEEM,
        status: TRANSACTION_STATUS.PENDING
      }, this.context)

      if (_.size(redeemTransaction.errors)) return this.mergeErrors(redeemTransaction.errors)
      return { redeemTransaction: redeemTransaction.result }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
