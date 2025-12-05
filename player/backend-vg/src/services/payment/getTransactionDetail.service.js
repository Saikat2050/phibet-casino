import ServiceBase from '../serviceBase'
import { convertToDecimal } from '../../utils/common'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'
import socketServer from '../../libs/socketServer'

export class GetTransactionDetailService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: {
        TransactionBanking: TransactionBankingModel
      }
    } = this.context

    const { transactionId } = this.args

    const transactionDetails = await TransactionBankingModel.findOne({
      where: {
        transactionId,
        actioneeId: user.userId
      }
    })

    if (!transactionDetails) return this.addError('TransactionNotFoundErrorType')
    if (transactionDetails.status === TRANSACTION_STATUS.PENDING && +transactionDetails.promocodeId > 0) {
      const activeCount = await socketServer.redisClient.get(`promocodeCount:${transactionDetails.promocodeId}:${user.userId}`)
      if (activeCount && +activeCount > 0) await socketServer.redisClient.decr(`promocodeCount:${transactionDetails.promocodeId}:${user.userId}`)
    }
    if (transactionDetails.status === TRANSACTION_STATUS.SUCCESS || transactionDetails.status === TRANSACTION_STATUS.PENDING) {
      return {
        success: true,
        isFirstDeposit: transactionDetails.isFirstDeposit,
        transactionId: transactionDetails.transactionId,
        amount: convertToDecimal(transactionDetails.amount),
        packageId: transactionDetails?.packageId,
        scCoin: transactionDetails.scCoin,
        gcCoin: transactionDetails.gcCoin,
        transactionStatus: transactionDetails.status,
        paymentMethod: transactionDetails?.moreDetails?.paymentType,
        message: transactionDetails.status === TRANSACTION_STATUS.SUCCESS ? 'Transaction was successfully completed.' : 'Transaction is currently pending. Please check back later.'
      }
    } else {
      return {
        success: false,
        isFirstDeposit: transactionDetails.isFirstDeposit,
        transactionId: transactionDetails.transactionId,
        amount: convertToDecimal(transactionDetails.amount),
        packageId: transactionDetails?.packageId,
        scCoin: transactionDetails.scCoin,
        gcCoin: transactionDetails.gcCoin,
        transactionStatus: transactionDetails.status,
        paymentMethod: transactionDetails?.moreDetails?.paymentType,
        message: 'Transaction failed, please contact support for more details.'
      }
    }
  }
}
