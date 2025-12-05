import ajv from '@src/libs/ajv'
import { v4 as uuid } from 'uuid'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { NumberPrecision } from '@src/libs/numberPrecision'
import { PaysafeAxios } from '@src/libs/axios/paysafe.axios'
import { appConfig, paysafePaymentGateWay } from '@src/configs'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { PAYMENT_TYPE, PAYSAFE_PAYMENT_STATUS, PAYSAFE_TRANSACTION_TYPE } from '@src/utils/constants/payment.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    user: { type: 'object' },
    amount: { type: 'number' },
    walletId: { type: 'number' }
  },
  required: ['amount', 'walletId', 'email']
})

export class PaysafeBankRegistrationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user } = this.args
      const wallet = await this.context.sequelize.models.wallet.findOne({
        where: { id: this.args.walletId, userId: user.id },
        attributes: ['currencyId', 'amount', 'userId'],
        include: {
          model: this.context.sequelize.models.currency,
          attributes: ['code']
        },
        required: true
      })
      if (!wallet) return this.addError('InvalidWalletIdErrorType')
      if (this.args.amount > wallet.amount) return this.addError('NotEnoughAmountErrorType')

      const [year, month, day] = user?.dateOfBirth?.split('-')
      const dateOfBirth = user?.dateOfBirth ? { year, month, day } : {}

      const paymentHandleToken = await PaysafeAxios.createPaymentHandle({
        body: {
          accountId: paysafePaymentGateWay.payByBankAccountId,
          merchantRefNum: uuid(),
          transactionType: PAYSAFE_TRANSACTION_TYPE.STANDALONE_CREDIT,
          paymentType: PAYMENT_TYPE.PAY_BY_BANK,
          amount: `${NumberPrecision.times(+this.args.amount, 100)}`,
          currencyCode: 'USD',
          payByBank: {
            consumerId: user.id
          },
          profile: {
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: dateOfBirth,
            email: user.email,
            phone: user.phone
          },
          billingDetails: {
            street1: user.addressLine_1,
            city: user.city,
            state: '',
            country: 'US',
            zip: user.zipCode
          },
          returnLinks: [
            {
              rel: 'on_failed',
              href: `${appConfig.app.userFeUrl}/user/redeem?success=false`
            },
            {
              rel: 'default',
              href: `${appConfig.app.userFeUrl}/user/redeem?success=true`
            }
          ]
        }
      })

      if (paymentHandleToken.status === PAYSAFE_PAYMENT_STATUS.FAILED) return this.addError('RegisterNewBankAccountErrorType')
      if (paymentHandleToken.status === PAYSAFE_PAYMENT_STATUS.INITIATED) {
        await Cache.del(`${CACHE_KEYS.PAYSAFE_BANK_DETAILS}${user.id}`)
        return { success: true, redirectUrl: paymentHandleToken.links[0].href }
      }

      return this.addError('RegisterNewBankAccountErrorType')
    } catch (error) {
      throw new APIError(error)
    }
  }
}
