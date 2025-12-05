import ajv from '@src/libs/ajv'
import { v4 as uuid } from 'uuid'
import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import { Cache } from '@src/libs/cache'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { PaysafeAxios } from '@src/libs/axios/paysafe.axios'
import { paysafePaymentGateWay } from '@src/configs'
import { PAYMENT_TYPE, PAYSAFE_PAYMENT_STATUS, PAYSAFE_TRANSACTION_TYPE } from '@src/utils/constants/payment.constants'
import { NumberPrecision } from '@src/libs/numberPrecision'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    user: { type: 'object' }
  },
  required: ['user']
})

export class GetPaysafeBanksService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user } = this.args
    let banks

    try {
      const bankDetails = await Cache.get(`${CACHE_KEYS.PAYSAFE_BANK_DETAILS}${user.id}`)

      if (!bankDetails) {
        const checkUserExists = await PaysafeAxios.createPaymentHandle({
          body: {
            accountId: paysafePaymentGateWay.payByBankAccountId,
            merchantRefNum: uuid(),
            transactionType: PAYSAFE_TRANSACTION_TYPE.STANDALONE_CREDIT,
            paymentType: PAYMENT_TYPE.PAY_BY_BANK,
            currencyCode: 'USD',
            payByBank: { consumerId: user.id }
          }
        })

        if (checkUserExists.status === PAYSAFE_PAYMENT_STATUS.FAILED) return this.addError('')
        if (checkUserExists.status === PAYSAFE_PAYMENT_STATUS.PAYABLE) {
          const getBankDetails = await PaysafeAxios.createCustomerVerification({
            body: {
              merchantRefNum: uuid(),
              amount: `${NumberPrecision.times(1, 100)}`,
              currencyCode: 'USD',
              dupCheck: true,
              paymentHandleToken: checkUserExists.paymentHandleToken
            }
          })

          if (getBankDetails.status !== PAYSAFE_PAYMENT_STATUS.COMPLETED) return this.addError('')

          banks = getBankDetails.payByBank?.achBankAccounts
          await Cache.set(`${CACHE_KEYS.PAYSAFE_BANK_DETAILS}${user.id}`, JSON.stringify(banks))
        }
      } else banks = JSON.parse(bankDetails)

      return { banks }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
