import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { emitPaymentTransaction, emitUserWallet } from '@src/socket-resources/emitters/wallet.emitter'
import { LEDGER_PURPOSE, LEDGER_RULES, LEDGER_TRANSACTION_TYPE, LEDGER_TYPES, TRANSACTION_STATUS, WITHDRAWAL_TYPES, CURRENCY_CODE } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    moreDetails: { type: 'object' },
    amount: { type: ['number', 'null'] },
    walletId: { type: ['string', 'null'] },
    paymentId: { type: ['string', 'null'] },
    packageId: { type: ['string', 'null'] },
    transactionId: { type: ['string', 'null'] },
    paymentProviderId: { type: ['number', 'null'] },
    purpose: { enum: Object.values(LEDGER_PURPOSE) },
    status: { enum: Object.values(TRANSACTION_STATUS), default: TRANSACTION_STATUS.PENDING }
  },
  required: ['userId', 'walletId', 'purpose', 'amount']
})

export class PaymentTransactionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const purpose = this.args.purpose
      const type = LEDGER_RULES[purpose]
      const amount = this?.args?.amount || 0
      const userId = this.args.userId
      const transaction = this.context.sequelizeTransaction
      const WalletModel = this.context.sequelize.models.wallet
      const CurrencyModel = this.context.sequelize.models.currency
      let toWalletId = null
      let fromWalletId = null
      let transactionRecord, wallet

      if (this.args.walletId || this.args.purpose === LEDGER_PURPOSE.REDEEEM_FAILED) {
        const options = this.args.purpose === LEDGER_PURPOSE.REDEEEM_FAILED
          ? {
              where: { userId },
              include: [{ model: CurrencyModel, attributes: ['id'], where: { code: CURRENCY_CODE.RSC } }]
            }
          : { where: { id: this.args.walletId, userId } }

        wallet = await WalletModel.findOne({
          ...options,
          lock: transaction.LOCK.UPDATE,
          transaction
        })

        if (!wallet) return this.addError('InvalidWalletIdErrorType')
        if (type === LEDGER_TYPES.DEBIT) {
          fromWalletId = wallet.id
          wallet.amount = NumberPrecision.minus(wallet.amount, amount)
          if (wallet.amount < 0) return this.addError('NotEnoughAmountErrorType')
        } else if ((type === LEDGER_TYPES.CREDIT && this.args.status === TRANSACTION_STATUS.COMPLETED) || this.args.purpose === LEDGER_PURPOSE.REDEEEM_FAILED) {
          wallet.amount = NumberPrecision.plus(wallet.amount, amount)
          toWalletId = wallet.id
        }

        await wallet.save({ transaction })
      }

      if (this.args?.transactionId) {
        transactionRecord = await this.context.sequelize.models.transaction.findOrCreate({
          where: { moreDetails: { transactionId: this.args.moreDetails.transactionId } },
          defaults: {
            userId,
            status: this.args.status,
            packageId: this.args.packageId,
            moreDetails: this.args.moreDetails,
            paymentId: this?.args?.paymentId || '',
            paymentProviderId: this.args.paymentProviderId,
            ...this.args.amount && { amount: this.args.amount }
          },
          raw: true,
          transaction
        })
      } else {
        transactionRecord = await this.context.sequelize.models.transaction.create({
          userId,
          status: this.args.purpose === LEDGER_PURPOSE.REDEEEM_FAILED ? TRANSACTION_STATUS.COMPLETED : TRANSACTION_STATUS.PENDING,
          paymentId: this.args.paymentId,
          paymentProviderId: this.args.paymentProviderId,
          moreDetails: this.args.moreDetails,
          ...this.args.amount && { amount: this.args.amount }
        }, { transaction })
      }

      if (type === LEDGER_TYPES.DEBIT) {
        await this.context.sequelize.models.withdrawal.create({
          userId,
          status: TRANSACTION_STATUS.PENDING,
          transactionId: transactionRecord?.id || transactionRecord?.[0]?.id,
          type: WITHDRAWAL_TYPES.BANK,
          amount
        }, { transaction })
      }

      if (this.args.status === TRANSACTION_STATUS.COMPLETED || type === LEDGER_TYPES.DEBIT || this.args.purpose === LEDGER_PURPOSE.REDEEEM_FAILED) {
        await this.context.sequelize.models.ledger.create({
          purpose,
          toWalletId,
          fromWalletId,
          transactionId: transactionRecord?.id || transactionRecord?.[0]?.id,
          currencyId: wallet.currencyId,
          amount: this.args.amount,
          transactionType: (this.args.purpose === LEDGER_PURPOSE.REDEEEM_FAILED)
            ? LEDGER_TRANSACTION_TYPE.REDEEM
            : (type === LEDGER_TYPES.DEBIT)
                ? LEDGER_TRANSACTION_TYPE.REDEEM
                : LEDGER_TRANSACTION_TYPE.PURCHASE
        }, { transaction })
      }
      const isPurchasePurpose = this.args.purpose &&
        [
          LEDGER_PURPOSE.PURCHASE_GC_COIN,
          LEDGER_PURPOSE.PURCHASE_SC_COIN,
          LEDGER_PURPOSE.PURCHASE_GC_BONUS,
          LEDGER_PURPOSE.PURCHASE_SC_BONUS
        ].includes(this.args.purpose)

      if ((this.args.status !== TRANSACTION_STATUS.PENDING && (transactionRecord?.status || transactionRecord[0]?.status === TRANSACTION_STATUS.PENDING)) || (isPurchasePurpose && this.args.status === TRANSACTION_STATUS.COMPLETED)) {
        await this.context.sequelize.models.transaction.update(
          {
            status: this.args.status,
            moreDetails: { ...(transactionRecord?.moreDetails || transactionRecord?.[0]?.moreDetails), ...this.args.moreDetails }
          },
          {
            where: {
              ...this.args.paymentId && { paymentId: this.args.paymentId },
              ...this.args.paymentProviderId && { paymentProviderId: this.args.paymentProviderId },
              moreDetails: { transactionId: this.args.moreDetails.transactionId }
            },
            transaction
          }
        )
      }

      if (wallet) emitUserWallet(wallet.userId, wallet)
      if (LEDGER_PURPOSE.PURCHASE_GC_COIN === this.args.purpose && this.args.status === TRANSACTION_STATUS.COMPLETED) emitPaymentTransaction(userId, { status: TRANSACTION_STATUS.COMPLETED, userId, transactionId: this.args.paymentId })

      return transactionRecord
    } catch (error) {
      throw new APIError(error)
    }
  }
}
