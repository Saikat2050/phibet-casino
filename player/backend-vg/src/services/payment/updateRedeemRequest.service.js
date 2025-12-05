import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { TRANSACTION_STATUS } from '../../utils/constants/constant'

export class UpdateRedeemRequestService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: { WithdrawRequest: WithdrawRequestModel },
      sequelizeTransaction: transaction
    } = this.context

    const { transactionId, actionableEmail } = this.args

    const ifWithdrawRequestExist = await WithdrawRequestModel.findOne({
      where: {
        transactionId: transactionId,
        userId: user.userId,
        status: TRANSACTION_STATUS.PENDING
      }
    })

    if (!ifWithdrawRequestExist) return this.addError('WithdrawRequestDoesNotExistErrorType')

    if (actionableEmail !== ifWithdrawRequestExist.actionableEmail) {
      ifWithdrawRequestExist.actionableEmail = actionableEmail
      await ifWithdrawRequestExist.save({ transaction })
    }

    return { success: true, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }
}
