import { plus } from 'number-precision'
import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { ROLE, TRANSACTION_STATUS } from '../../utils/constants/constant'
import WalletEmitter from '../../socket-resources/emitter/wallet.emitter'

export class CancelRedeemRequestService extends ServiceBase {
  async run () {
    const { transactionId } = this.args
    const {
      req: {
        user: { detail }
      },
      dbModels: { Wallet: WalletModel, WithdrawRequest: WithdrawRequestModel },
      sequelizeTransaction: transaction
    } = this.context

    try {
      const requestDetails = await WithdrawRequestModel.findOne({
        where: {
          transactionId,
          userId: detail.userId,
          status: TRANSACTION_STATUS.PENDING
        },
        attributes: [
          'status',
          'amount',
          'paymentProvider',
          'moreDetails',
          'transactionId'
        ],
        transaction
      })
      if (!requestDetails) return this.addError('RequestNotFoundErrorType')

      if (requestDetails.status !== TRANSACTION_STATUS.PENDING) { return this.addError('SomethingWentWrongErrorType') }

      const userWallet = await WalletModel.findOne({
        where: { ownerId: detail.userId },
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      await WithdrawRequestModel.update(
        {
          actionableId: detail.userId,
          actionedAt: new Date(),
          status: TRANSACTION_STATUS.CANCELLED,
          moreDetails: { ...requestDetails.moreDetails, role: ROLE.USER }
        },
        {
          where: { transactionId },
          transaction
        }
      )

      await userWallet.reload({
        lock: { level: transaction.LOCK.UPDATE, of: WalletModel },
        transaction
      })

      userWallet.scCoin = {
        ...userWallet.scCoin,
        wsc: +plus(+userWallet.scCoin.wsc, +requestDetails.amount).toFixed(2)
      }

      WalletEmitter.emitUserWalletBalance(
        {
          scCoin: +plus(
            +userWallet.scCoin.bsc,
            +userWallet.scCoin.psc,
            +userWallet.scCoin.wsc
          ).toFixed(2),
          gcCoin: +userWallet.gcCoin.toFixed(2),
          wsc: +userWallet.scCoin.wsc.toFixed(2)
        },
        detail.userId
      )

      await userWallet.save({ transaction })

      return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
