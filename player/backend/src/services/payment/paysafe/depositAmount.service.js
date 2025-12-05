import ajv from '@src/libs/ajv'
import { v4 as uuid } from 'uuid'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { PaysafeAxios } from '@src/libs/axios/paysafe.axios'
import { PaymentTransactionService } from '../../transaction/paymentTransaction.service'
import { LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { PAYSAFE_PAYMENT_TYPE, TRANSACTION_STATUS } from '@src/utils/constants/payment.constants'

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

export class PaysafeDepositAmountService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user, amount, ipAddress, packageDetail, promocodeDetail, paymentProviderId } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      if (!user.paysafeCustomerId) {
        // const [year, month, day] = user?.dateOfBirth?.split('-')
        const dob = new Date(user.dateOfBirth)
        const year = dob.getUTCFullYear()
        const month = dob.getUTCMonth() + 1
        const day = dob.getUTCDate()
        const dateOfBirth = user?.dateOfBirth ? { year, month, day } : {}

        const paysafeUser = await PaysafeAxios.createCustomer({
          body: {
            merchantCustomerId: `${user.uniqueId}${new Date().toISOString()}`,
            locale: 'en_US',
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            dateOfBirth: dateOfBirth,
            email: user.email,
            ip: ipAddress,
            gender: user.gender === 'male' ? 'M' : 'F',
            nationality: 'USA'
          }
        })

        user.paysafeCustomerId = paysafeUser?.id
        await this.context.sequelize.models.user.update({ paysafeCustomerId: paysafeUser?.id }, { where: { id: user.id } })
      }

      const moreDetails = {
        promocode: promocodeDetail,
        transactionId: uuid(),
        gcCoin: packageDetail.gcCoin,
        scCoin: packageDetail.scCoin,
        gcBonus: packageDetail.gcBonus,
        scBonus: packageDetail.scBonus
      }

      await PaymentTransactionService.execute({
        transactionId: moreDetails.transactionId,
        moreDetails,
        userId: user.id,
        paymentProviderId,
        packageId: packageDetail.id,
        purpose: LEDGER_PURPOSE.PURCHASE,
        status: TRANSACTION_STATUS.PENDING,
        amount
      }, this.context)

      const paysafeUserToken = await PaysafeAxios.createCustomerToken({
        body: {
          merchantRefNum: moreDetails.transactionId,
          paymentType: PAYSAFE_PAYMENT_TYPE
        },
        id: user.paysafeCustomerId
      })
      await this.context.sequelize.models.transaction.update(
        { paymentId: paysafeUserToken.id },
        { where: { moreDetails: { transactionId: moreDetails.transactionId } }, transaction }
      )

      return {
        singleUseCustomerToken: paysafeUserToken.singleUseCustomerToken,
        merchantRefNum: moreDetails.transactionId,
        amount: +NumberPrecision.times(+NumberPrecision.round(amount, 2), 100).toFixed(0)
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
