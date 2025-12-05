import { sequelize } from '@src/database'
import { Logger } from '@src/libs/logger'
import { ServiceBase } from '@src/libs/serviceBase'
import { LEDGER_TRANSACTION_TYPE } from '@src/utils/constants/payment.constants'
import { CURRENCY_CODE, LEDGER_PURPOSE, TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { CreateTransactionService } from '../common/createTransaction.service'
import { v4 as uuid } from 'uuid'
import { paysafe } from '@src/configs'
import np from 'number-precision'
import { Op } from 'sequelize'
import { config } from '@src/configs/config'
import axios from 'axios'

export class PayByBankWithdrawlRequestService extends ServiceBase {
  async run () {
    const { sequelizeTransaction } = this.context
    const { withdrawlRequestId } = this.args

    const {
      withdrawal: withdrawlModel,
      transaction: transactionModel,
      user: userModel,
      address: addressModel
    } = sequelize.models

    try {
      const withdrawlRequest = await withdrawlModel.findOne({
        where: { withdrawlRequestId, status: TRANSACTION_STATUS.IN_PROGRESS },
        include: {
          model: userModel,
          required: true,
          include: {
            model: addressModel,
            required: true
          }
        },
        transaction: sequelizeTransaction
      })
      if (!withdrawlRequest) return this.addError('WithdrawlNotExistErrorType')

      const withdrawlTransaction = await transactionModel.findOne({
        where: {
          moreDetails: { [Op.contains]: { transactionId: withdrawlRequest.transactionId } },
          status: TRANSACTION_STATUS.IN_PROGRESS
        },
        transaction: sequelizeTransaction
      })
      if (!withdrawlTransaction) return this.addError('TransactionNotExistErrorType')

      // API 1
      const checkIfUserExistsOptions = {
        url: `${paysafe.baseUrl}/v1/paymenthandles`,
        method: 'POST',
        headers: this.generatePaysafeHeaders(),
        data: {
          accountId: paysafe.paysafePayByBankAccountId,
          merchantRefNum: uuid(),
          transactionType: 'VERIFICATION',
          paymentType: 'PAY_BY_BANK',
          currencyCode: 'USD',
          payByBank: {
            consumerId: withdrawlRequest.user.uniqueId
          }
        }
      }
      const checkIfUserExistsResponse = await this.thirdPartyAxiosCall(withdrawlRequest, withdrawlTransaction, checkIfUserExistsOptions)
      if (checkIfUserExistsResponse.status !== 'PAYABLE') await this.failWithdrawRequestProcess(withdrawlRequest, withdrawlTransaction, checkIfUserExistsResponse)

      // API 2
      const getBankDetailsOptions = {
        url: `${paysafe.baseUrl}/v1/verifications`,
        method: 'POST',
        headers: this.generatePaysafeHeaders(),
        data: {
          merchantRefNum: uuid(),
          amount: `${np.round(np.times(+withdrawlRequest.amount, 100), 0)}`,
          currencyCode: 'USD',
          dupCheck: true,
          paymentHandleToken: checkIfUserExistsResponse.paymentHandleToken
        }
      }
      const getBankDetailsResponse = await this.thirdPartyAxiosCall(withdrawlRequest, withdrawlTransaction, getBankDetailsOptions)
      if (getBankDetailsResponse.status !== 'COMPLETED') await this.failWithdrawRequestProcess(withdrawlRequest, withdrawlTransaction, getBankDetailsResponse)

      const bankDetails = getBankDetailsResponse?.payByBank?.achBankAccounts
      const bankDetail = bankDetails.find(bankDetail => bankDetail.id === withdrawlRequest.actionableEmail)
      if (!bankDetail) await this.failWithdrawRequestProcess(withdrawlRequest, withdrawlTransaction, getBankDetailsResponse)

      const [year, month, day] = withdrawlRequest.user?.dateOfBirth.split('-')
      const dateOfBirth = withdrawlRequest.User?.dateOfBirth ? { year, month, day } : {}

      // API 3
      const createStandalonePaymentOptions = {
        url: `${paysafe.baseUrl}/v1/paymenthandles`,
        method: 'POST',
        headers: this.generatePaysafeHeaders(),
        data: {
          accountId: paysafe.paysafePayByBankAccountId,
          merchantRefNum: withdrawlRequest.id,
          transactionType: 'STANDALONE_CREDIT',
          paymentType: 'PAY_BY_BANK',
          currencyCode: 'USD',
          amount: `${np.round(np.times(+withdrawlRequest.amount, 100), 0)}`,
          payByBank: {
            consumerId: withdrawlRequest.user.uniqueId,
            ach: {
              paymentHandleToken: bankDetail.paymentHandleToken,
              routingNumber: bankDetail.routingNumber,
              lastDigits: bankDetail.lastDigits
            }
          },
          profile: {
            firstName: withdrawlRequest.user.firstName,
            lastName: withdrawlRequest.user.lastName,
            dateOfBirth,
            email: withdrawlRequest.user.email,
            phone: withdrawlRequest.user.phone
          },
          billingDetails: {
            street1: withdrawlRequest.user.address.address1, // check this before proceding
            city: withdrawlRequest.user.address.city,
            state: withdrawlRequest.user.stateCode, // check this field is required or not
            country: withdrawlRequest.user.address.countryCode,
            zip: withdrawlRequest.user.address.zipCode
          }
        }
      }
      const createStandalonePaymentResponse = await this.thirdPartyAxiosCall(withdrawlRequest, withdrawlTransaction, createStandalonePaymentOptions)
      if (createStandalonePaymentResponse.status !== 'PAYABLE') await this.failWithdrawRequestProcess(withdrawlRequest, withdrawlTransaction, createStandalonePaymentResponse)

      // API 4
      const creditStandAlonePaymentOptions = {
        url: `${paysafe.baseUrl}/v1/standalonecredits`,
        method: 'POST',
        headers: this.generatePaysafeHeaders(),
        data: {
          accountId: paysafe.paysafePayByBankAccountId,
          merchantRefNum: withdrawlRequest.id,
          amount: `${np.round(np.times(+withdrawlRequest.amount, 100), 0)}`,
          currencyCode: 'USD',
          paymentHandleToken: createStandalonePaymentResponse.paymentHandleToken
        }
      }
      const creditStandAlonePaymentResponse = await this.thirdPartyAxiosCall(withdrawlRequest, withdrawlTransaction, creditStandAlonePaymentOptions)
      if (creditStandAlonePaymentResponse.status !== 'COMPLETED') await this.failWithdrawRequestProcess(withdrawlRequest, withdrawlTransaction, creditStandAlonePaymentResponse)

      await this.confirmWithdrawRequestProcess(withdrawlRequest, withdrawlTransaction, creditStandAlonePaymentResponse)

      return { success: true, message: 'Redeem Request Successfully Processed' }
    } catch (error) {
      Logger.error('Pay By Bank Withdrawl Request Service', { message: 'error in service', exception: error })
      return { success: false, message: 'Error in Pay By Bank Withdrawl Request Service', data: null, error }
    }
  }

  generatePaysafeHeaders = () => {
    return {
      Simulator: 'EXTERNAL',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${config.get('payment.paysafe.username')}:${config.get('payment.paysafe.password')}`).toString('base64')}`
    }
  }

  async thirdPartyAxiosCall (withdrawlRequest, withdrawlTransaction, options) {
    try {
      const { data } = await axios(options)
      return data
    } catch (error) {
      console.log('Error while doing pay by bank withdrawl request', 'Error was', JSON.stringify(error), 'Request Options was', JSON.stringify(options))
      await this.failWithdrawRequestProcess(withdrawlRequest, withdrawlTransaction, error.response.data)
      return this.addError('InternalServerErrorType')
    }
  }

  async failWithdrawRequestProcess (withdrawlRequest, withdrawlTransaction, error) {
    const { sequelizeTransaction } = this.context
    const user = withdrawlRequest.user

    // updating withdrawl request data
    withdrawlRequest.status = TRANSACTION_STATUS.FAILED
    const moreDetails = { ...JSON.parse(withdrawlRequest.moreDetails), error } // Withdraw request moreDetails are JSON stringified
    withdrawlRequest.moreDetails = JSON.stringify(moreDetails)
    await withdrawlRequest.save({ transaction: sequelizeTransaction })

    // updating withdrawl transaction row
    withdrawlTransaction.status = TRANSACTION_STATUS.FAILED
    const transactionMoreDetails = { ...JSON.parse(withdrawlTransaction.moreDetails), error }
    withdrawlTransaction.moreDetails = JSON.stringify(transactionMoreDetails)
    await withdrawlTransaction.save({ transaction: sequelizeTransaction })

    // creating entry in transaction and ledger table
    const result = await CreateTransactionService({
      userId: user.id,
      paymentId: withdrawlRequest.paymentId,
      purpose: LEDGER_PURPOSE.REDEEM_FAILED,
      amount: withdrawlRequest.amount,
      code: CURRENCY_CODE.RSC,
      transactionType: LEDGER_TRANSACTION_TYPE.REDEEM,
      paymentProviderId: withdrawlRequest.paymentProviderId,
      moreDetails: { error },
      seqTransaction: sequelizeTransaction
    })
    if (_.size(result.errors)) return this.mergeErrors(result.errors)
    withdrawlRequest.failedTransactionId = result.result.id

    await sequelizeTransaction.commit()
    return this.addError('WithdrawRequestFailed')
  }

  async confirmWithdrawRequestProcess (withdrawlRequest, withdrawlTransaction, responseData) {
    const { sequelizeTransaction } = this.context

    // updating withdrawl request data
    withdrawlRequest.status = TRANSACTION_STATUS.COMPLETED
    const moreDetails = { ...JSON.parse(withdrawlRequest.moreDetails), responseData } // Withdraw request moreDetails are JSON stringified
    withdrawlRequest.moreDetails = JSON.stringify(moreDetails)
    await withdrawlRequest.save({ transaction: sequelizeTransaction })

    // updating withdrawl transaction row
    withdrawlTransaction.status = TRANSACTION_STATUS.COMPLETED
    withdrawlTransaction.paymentTransactionId = responseData.id
    const transactionMoreDetails = { ...JSON.parse(withdrawlTransaction.moreDetails), responseData }
    withdrawlTransaction.moreDetails = JSON.stringify(transactionMoreDetails)
    await withdrawlTransaction.save({ transaction: sequelizeTransaction })

    // send mail other notification or send confirmation data to the third party
    //
    //
    //  SEND MAIL HERE
    //
    //

    return { success: true, message: 'Redeem Request Successfully Processed' }
  }
}
