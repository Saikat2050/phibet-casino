import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { round, times } from 'number-precision'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import ServiceBase from '../../serviceBase'
import config from '../../../configs/app.config'
import socketServer from '../../../libs/socketServer'
import { generatePaysafeHeaders } from '../../../utils/common'

export class PayByBankUserBankAccountDetailsService extends ServiceBase {
  async run () {
    // Getting userId and unique id from body ( Added from isUserAuthenticated middleware )
    const { id: userId, uniqueId, amount = 1 } = this.args

    const bankDetails = await socketServer.redisClient.get(`payByBankDetails:${userId}`)

    if (bankDetails) {
      return {
        success: true,
        message: SUCCESS_MSG.GET_SUCCESS,
        bankDetails: JSON.parse(bankDetails)
      }
    }

    const checkIfUserExistsOptions = {
      url: `${config.get('paysafe.base_url')}/v1/paymenthandles`,
      method: 'POST',
      headers: generatePaysafeHeaders(),
      data: {
        accountId: config.get('paysafe.pay_by_bank_account_id'),
        merchantRefNum: `${uuid()}`, // No need to store this
        transactionType: 'VERIFICATION',
        paymentType: 'PAY_BY_BANK',
        currencyCode: 'USD',
        payByBank: {
          consumerId: uniqueId
        }
      }
    }

    try {
      const { data } = await axios(checkIfUserExistsOptions)
      const { status, paymentHandleToken } = data
      if (status === 'FAILED') return this.addError('UserNotRegisteredErrorType')

      if (status === 'PAYABLE') {
        const getBankDetailsOptions = {
          url: `${config.get('paysafe.base_url')}/v1/verifications`,
          method: 'POST',
          headers: generatePaysafeHeaders(),
          data: {
            merchantRefNum: uuid(),
            amount: `${+round(times(+amount, 100), 0)}`,
            currencyCode: 'USD',
            dupCheck: true,
            paymentHandleToken: paymentHandleToken
          }
        }

        try {
          const { data: { status, payByBank } } = await axios(getBankDetailsOptions)
          if (status === 'COMPLETED') {
            const bankDetails = payByBank?.achBankAccounts
            await socketServer.redisClient.set(`payByBankDetails:${userId}`, JSON.stringify(bankDetails))
            return {
              success: true,
              message: SUCCESS_MSG.GET_SUCCESS,
              bankDetails: payByBank?.achBankAccounts
            }
          }
        } catch (error) {
          console.log(error)
          return this.addError('BankDetailsNotFoundErrorType')
        }
      }
      return this.addError('BankDetailsNotFoundErrorType')
    } catch (error) {
      console.log(error)
      return this.addError('UserNotRegisteredErrorType')
    }
  }

  // convertBankAccountObject (bankDetails) {
  //   return bankDetails.reduce((acc, item) => {
  //     acc[item.id] = {
  //       accountId: item.id,
  //       lastDigits: item.lastDigits,
  //       routingNumber: item.routingNumber,
  //       bankName: item.bankName,
  //       accountHolderName: item.accountHolderName,
  //       allowedTypes: item.allowedTypes,
  //       paymentHandleToken: item.paymentHandleToken
  //     }
  //     return acc
  //   }, {})
  // }
}
