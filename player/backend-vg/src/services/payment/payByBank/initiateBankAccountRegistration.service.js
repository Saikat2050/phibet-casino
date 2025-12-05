import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { times } from 'number-precision'
import ServiceBase from '../../serviceBase'
import config from '../../../configs/app.config'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { deleteRedisToken, generatePaysafeHeaders } from '../../../utils/common'

export class PayByBankInitiateBankAccountRegistrationService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: userDetails }
      },
      dbModels: { State: StateModel }
    } = this.context

    const { amount = 1 } = this.args

    const [year, month, day] = userDetails?.dateOfBirth.split('-')

    const dateOfBirth = userDetails?.dateOfBirth ? { year, month, day } : {}

    if (!userDetails.firstName || !userDetails.lastName || !userDetails.dateOfBirth || !userDetails.phone) return this.addError('ProfileIncompleteErrorType') // To Be replaced/added in errors
    if (!userDetails.addressLine_1 || !userDetails.city || !userDetails.state || !userDetails.zipCode) return this.addError('ProfileIncompleteErrorType') // To Be replaced/added in errors

    const { stateCode } = await StateModel.findOne({
      attributes: ['stateCode'],
      where: { stateId: +userDetails.state },
      raw: true
    })

    const registerNewBankAccountOptions = {
      url: `${config.get('paysafe.base_url')}/v1/paymenthandles`,
      method: 'POST',
      headers: generatePaysafeHeaders(),
      data: {
        accountId: config.get('paysafe.pay_by_bank_account_id'),
        merchantRefNum: uuid(), // No need to store this
        transactionType: 'STANDALONE_CREDIT',
        paymentType: 'PAY_BY_BANK',
        amount: `${times(+amount, 100)}`,
        currencyCode: 'USD',
        payByBank: {
          consumerId: userDetails.uniqueId
        },
        profile: {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          dateOfBirth: dateOfBirth,
          email: userDetails.email,
          phone: userDetails.phone
        },
        billingDetails: {
          street1: userDetails.addressLine_1,
          city: userDetails.city,
          state: stateCode,
          country: 'US',
          zip: userDetails.zipCode
        },
        returnLinks: [
          {
            rel: 'default',
            href: `${config.get('frontendUrl')}/user/redeem?success=true`
          },
          {
            rel: 'on_failed',
            href: `${config.get('frontendUrl')}/user/redeem?success=false`
          }
        ]
      }
    }

    try {
      const { data } = await axios(registerNewBankAccountOptions)

      if (data.status === 'FAILED') return this.addError('RegisterNewBankAccountErrorType')

      if (data.status === 'INITIATED') {
        await deleteRedisToken(`payByBankDetails:${userDetails.userId}`)
        return {
          success: true,
          message: SUCCESS_MSG.GET_SUCCESS,
          redirectUrl: data.links[0].href
        }
      }
      return this.addError('RegisterNewBankAccountErrorType')
    } catch (error) {
      console.log('slildfuasoipdfusa', error?.response?.data?.error)
      return this.addError('RegisterNewBankAccountErrorType')
    }
  }
}
