import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { TRANSACTION_STATUS } from '@src/utils/constants/payment.constants'
import { NumberPrecision } from '@src/libs/numberPrecision'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    transactionId: { type: 'string' },
    userId: { type: 'string' }
  }
})

export class GetTransactionDetailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { transactionId, userId } = this.args

    try {
      const transactionDetails = await this.context.sequelize.models.transaction.findOne({
        attributes: ['status', 'amount', 'packageId', 'moreDetails'],
        where: {
          moreDetails: { transactionId },
          userId
        },
        include: [
          {
            model: this.context.sequelize.models.ledger,
            as: 'transactionLedger',
            attributes: ['transactionType']
          }
        ]
      })

      if (!transactionDetails) return this.addError('TransactionNotFoundErrorType')

      const isTransactionSuccessful = transactionDetails?.status === TRANSACTION_STATUS.COMPLETED || transactionDetails?.status === TRANSACTION_STATUS.PENDING

      return {
        success: isTransactionSuccessful,
        // isFirstDeposit: transactionDetails?.isFirstDeposit, --later on
        transactionId: transactionDetails?.moreDetails?.transactionId,
        amount: +NumberPrecision.round(transactionDetails?.amount, 2).toFixed(0),
        packageId: transactionDetails?.packageId,
        scCoin: transactionDetails?.moreDetails?.scCoin,
        gcCoin: transactionDetails?.moreDetails?.gcCoin,
        transactionStatus: transactionDetails?.status,
        paymentMethod: transactionDetails?.transactionLedger?.[0]?.transactionType,
        message: isTransactionSuccessful
          ? transactionDetails?.status === TRANSACTION_STATUS.COMPLETED
              ? 'Transaction was successfully completed.'
              : 'Transaction is currently pending. Please check back later.'
          : 'Transaction failed, please contact support for more details.'
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
