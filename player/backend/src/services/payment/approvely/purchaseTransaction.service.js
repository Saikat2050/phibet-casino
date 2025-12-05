
import { APIError } from '@src/errors/api.error'
import { v4 as uuid } from 'uuid'
import ajv from '@src/libs/ajv'
import { ApprovelyAxios } from '@src/libs/axios/approvely.axios'
import { NumberPrecision } from '@src/libs/numberPrecision'
import ServiceBase from '@src/libs/serviceBase'
import { TRANSACTION_STATUS, LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { PaymentTransactionService } from '../../transaction/paymentTransaction.service'
import { appConfig } from '@src/configs'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    user: { type: 'object' },
    amount: { type: 'number' },
    ipAddress: { type: 'string' },
    packageDetail: { type: 'object' },
    paymentProviderId: { type: 'number' },
    promocodeDetail: { type: ['string', 'null'] }
  },
  required: ['amount', 'user']
})

export class CreateApprovelyPurchaseTxnService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, amount, ipAddress, packageDetail, promocodeDetail, paymentProviderId } = this.args

    try {
      const transactionId = uuid()

      // finding user address
      // we can skip it as it is not required..so no need for extra db call
      // const address = await this.context.sequelize.models.address.findOne({
      //   attributes: { include: ['address1', 'city', 'stateCode'] },
      //   where: { userId: user.id }
      // })

      const body = {
        email: user?.email,
        customerInfo: {
          name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
          verificationId: user?.id + '',
          // address: address?.address1,
          // city: address?.city,
          // state: address?.stateCode, -- need to fetch it from state code
          ip: ipAddress
        },
        chargebackProtectionData: [{
          productName: 'package',
          productType: 'gameOfSkill',
          quantity: 1,
          rawProductData: {
            description: 'The user is purchasing a package that grants them coins based on their selected package.',
            amount: +amount,
            ...packageDetail
          }
        }],
        // settlementType: 'Bank',
        subtotal: { cents: NumberPrecision.times(+amount, 100) },
        origin: [`${appConfig.app.userFeUrl}`],
        webhookInfo: {
          ...packageDetail,
          transactionId
        }
      }

      const approvelyTransactionResponse = await ApprovelyAxios.sendRequest(user?.uniqueId, body)

      const moreDetails = {
        promocode: promocodeDetail,
        transactionId,
        gcCoin: packageDetail?.gcCoin,
        scCoin: packageDetail?.scCoin,
        scBonus: packageDetail?.scBonus,
        gcBonus: packageDetail?.gcBonus
      }

      await PaymentTransactionService.execute({
        transactionId,
        moreDetails,
        userId: user?.id,
        paymentProviderId,
        packageId: packageDetail?.id,
        purpose: LEDGER_PURPOSE.PURCHASE,
        status: TRANSACTION_STATUS.PENDING,
        amount,
        paymentId: transactionId
      }, this.context)

      return {
        ...approvelyTransactionResponse,
        merchantRefNum: transactionId
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
