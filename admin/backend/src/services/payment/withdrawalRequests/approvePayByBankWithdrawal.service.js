import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { QueueWorkerAxios } from '@src/libs/axios/queueWorker.axios'
import { ServiceBase } from '@src/libs/serviceBase'
import { TRANSACTION_STATUS, WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    withdrawal: { type: 'object' },
    withdrawalTransaction: { type: 'object' }
  },
  required: ['withdrawal', 'withdrawalTransaction']
})

export class ApprovePayByBankWithdrawalsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { withdrawal, withdrawalTransaction } = this.args
    const transaction = this.context.sequelizeTransaction
    const {
      withdrawal: withdrawalModel,
      transaction: transactionModel
    } = this.context.sequelize.models

    try {
      await withdrawalModel.update({ status: WITHDRAWAL_STATUS.IN_PROGRESS }, { where: { id: withdrawal.id }, transaction })
      await transactionModel.update({ status: TRANSACTION_STATUS.IN_PROGRESS }, { where: { id: withdrawalTransaction.id }, transaction })

      await QueueWorkerAxios.scheduleWithdrawalRequestJob(withdrawal.id)

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
