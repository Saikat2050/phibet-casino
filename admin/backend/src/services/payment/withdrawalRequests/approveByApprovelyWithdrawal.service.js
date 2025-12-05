import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { TRANSACTION_STATUS, WITHDRAWAL_STATUS } from '@src/utils/constants/public.constants.utils'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { approvelyPaymentGateWay } from '@src/configs/payment/approvely.config'
import axios from 'axios'
import { Logger } from '@src/libs/logger'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    withdrawal: { type: 'object' },
    withdrawalTransaction: { type: 'object' },
    adminUserId: { type: 'string' }
  },
  required: ['withdrawal', 'withdrawalTransaction']
})

export class ApproveByApprovelyWithdrawalsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { withdrawal, withdrawalTransaction, adminUserId } = this.args
    const transaction = this.context.sequelizeTransaction
    const {
      withdrawal: withdrawalModel,
      transaction: transactionModel,
      user: userModel
    } = this.context.sequelize.models

    try {
      const userUniqueId = (await userModel.findOne({
        attributes: ['uniqueId'],
        where: { id: withdrawal?.userId },
        raw: true
      }))?.uniqueId

      const { bankAccountId, debitCardId } = withdrawalTransaction?.moreDetails || {}
      const body = {
        amount: {
          cents: NumberPrecision.times(+withdrawalTransaction.amount, 100)
        },
        speed: bankAccountId ? 'asap' : debitCardId ? 'card' : null,
        userId: userUniqueId,
        account: bankAccountId || debitCardId,
        idempotencyKey: withdrawal?.id
      }

      const response = await axios.post(`${approvelyPaymentGateWay.url}/api/merchant/withdraws/payout/delegated`, body, {
        headers: {
          Authorization: `${approvelyPaymentGateWay.privateApiKey}`,
          accept: 'application/json',
          'content-type': 'application/json'
        }
      })

      Logger.info(`----------- APPROVELY PAYLOAD -------------- ${JSON.stringify(body)}`)
      Logger.info(`----------- APPROVELY RESPONSE -------------- ${JSON.stringify(response?.data)}`)

      if (response.status === 200) {
        await transactionModel.update(
          { paymentId: response?.data?.signature, status: TRANSACTION_STATUS.IN_PROGRESS, actioneeId: adminUserId },
          { where: { id: withdrawalTransaction.id, userId: withdrawal?.userId }, transaction }
        )
        await withdrawalModel.update({ status: WITHDRAWAL_STATUS.IN_PROGRESS, approvedAt: Date.now() }, { where: { id: withdrawal.id, userId: withdrawal?.userId }, transaction })
        return { success: true }
      }
      if (response.status !== 200) throw response.data?.errors
    } catch (error) {
      throw new APIError(error)
    }
  }
}
