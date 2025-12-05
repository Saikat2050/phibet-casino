import axios from 'axios'
import config from '../../../configs/app.config'
import { v4 as uuid } from 'uuid'
import db from '../../../db/models'
import { PAYMENT_METHOD, ROLE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../../utils/constants/constant'
import { round } from 'number-precision'
import { InternalServerErrorType, MinimumBalanceErrorType } from '../../../utils/constants/errors'

export const initPushcashPayment = async ({
  user,
  ipAddress,
  packageDetail,
  amount,
  promocodeDetail,
  transaction
}) => {
  const transactionId = uuid()
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Idempotency-Key': transactionId,
    Authorization: `Bearer ${config.get('pushcash.api_key')}`
  }
  if (!user.pushcashUserId) {
    const { stateCode } = await db.State.findOne({
      attributes: ['stateCode'],
      where: { stateId: +user.state },
      raw: true
    })

    const createPushcashUserIdOptions = {
      url: `${config.get('pushcash.base_url')}/user`,
      method: 'POST',
      headers,
      data: {
        name: {
          first: user.firstName,
          last: user.lastName
        },
        email: user.email,
        address: {
          address_line_1: user.addressLine_1,
          locality: user.city,
          administrative_area: stateCode || '',
          postal_code: String(user.zipCode),
          country: 'US'
        },
        date_of_birth: user.dateOfBirth,
        phone_number: user.phone,
        tag: String(user.userId),
        identity_verified: true
      }
    }
    try {
      const { data: pushcashUser } = await axios(createPushcashUserIdOptions)
      user.pushcashUserId = pushcashUser?.id
      await user.save()
    } catch (error) {
      console.log('errrorrrrrr', error)
    }
  }

  // payment intent
  const paymentPayload = {
    url: `${config.get('pushcash.base_url')}/intent`,
    method: 'POST',
    headers,
    data: {
      user_id: user.pushcashUserId,
      amount: Math.round(amount * 100),
      direction: 'cash_in',
      currency: 'USD',
      redirect_url: config.get('pushcash.redirect_url'),
      webhook_url: config.get('pushcash.webhook_url')
    }
  }

  try {
    const paymentResponse = await axios(paymentPayload)
    if (!paymentResponse.data) {
      throw InternalServerErrorType
    }

    const moreDetails = {
      bonusSc: +round(+packageDetail.bonusSc, 2),
      bonusGc: +round(+packageDetail.bonusGc, 2),
      promocode: promocodeDetail
    }

    const moreDetailsString = JSON.stringify(moreDetails)

    const initiatedTransaction = await db.TransactionBanking.create(
      {
        actioneeType: ROLE.USER,
        actioneeId: user.userId,
        actioneeEmail: user.email,
        actioneeName: `${user.firstName} ${
        user.middleName ? `${user.middleName} ` : ''
      } ${user.lastName}`,
        walletId: user.userWallet.walletId,
        currencyCode: 'USD',
        amount: +round(+amount, 2),
        gcCoin: +round(+packageDetail.gcCoin, 2),
        scCoin: +round(+packageDetail.scCoin, 2),
        status: TRANSACTION_STATUS.PENDING,
        countryCode: 'US',
        transactionId,
        transactionDateTime: new Date(),
        transactionType: TRANSACTION_TYPE.DEPOSIT,
        isSuccess: false,
        paymentMethod: PAYMENT_METHOD.PUSHCASH,
        packageId: packageDetail.packageId,
        moreDetails: moreDetailsString
      },
      {
        transaction
      }
    )
    return { ...paymentResponse.data, transactionId: initiatedTransaction?.transactionId }
  } catch (error) {
    console.log('errorrrr while deposit amount', error.response?.data)
    throw InternalServerErrorType
  }
}

export const initPayoutPushcash = async ({
  user,
  amount,
  actionableEmail,
  transaction,
  paymentProvider,
  bankAccountId
}) => {
  const transactionId = uuid()
  if (!user.pushcashUserId) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Idempotency-Key': transactionId,
      Authorization: `Bearer ${config.get('pushcash.api_key')}`
    }
    const { stateCode } = await db.State.findOne({
      attributes: ['stateCode'],
      where: { stateId: +user.state },
      raw: true
    })

    const createPushcashUserIdOptions = {
      url: `${config.get('pushcash.base_url')}/user`,
      method: 'POST',
      headers,
      data: {
        name: {
          first: user.firstName,
          last: user.lastName
        },
        email: user.email,
        address: {
          address_line_1: user.addressLine_1,
          locality: user.city,
          administrative_area: stateCode || '',
          postal_code: String(user.zipCode),
          country: 'US'
        },
        date_of_birth: user.dateOfBirth,
        phone_number: user.phone,
        tag: String(user.userId),
        identity_verified: true
      }
    }
    try {
      const { data: pushcashUser } = await axios(createPushcashUserIdOptions)
      user.pushcashUserId = pushcashUser?.id
      await user.save()
    } catch (error) {
      console.log('errrorrrrrr', error)
    }
  }

  const userWallet = await db.Wallet.findOne({
    where: { ownerId: user.userId },
    lock: { level: transaction.LOCK.UPDATE, of: db.Wallet },
    transaction
  })

  if (+amount > userWallet.scCoin.wsc) throw MinimumBalanceErrorType

  const withdrawRequest = await db.WithdrawRequest.create(
    {
      userId: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      amount,
      transactionId,
      actionableEmail: paymentProvider === PAYMENT_METHOD.PAY_BY_BANK ? bankAccountId : actionableEmail,
      actionedAt: new Date(),
      paymentProvider: paymentProvider || PAYMENT_METHOD.PUSHCASH,
      status: TRANSACTION_STATUS.PUSHCASH
    },
    { transaction }
  )
  const withdrawTransaction = await db.TransactionBanking.create(
    {
      actioneeType: ROLE.USER,
      actioneeId: user.userId,
      actioneeEmail: user.email,
      actioneeName: `${user.firstName} ${
          user.middleName ? `${user.middleName} ` : ''
        } ${user.lastName}`,
      walletId: user.userWallet.walletId,
      currencyCode: 'USD',
      amount,
      countryCode: 'US',
      transactionId,
      transactionType: TRANSACTION_TYPE.WITHDRAW,
      paymentMethod: paymentProvider || PAYMENT_METHOD.PUSHCASH,
      gcCoin: 0,
      scCoin: amount,
      transactionDateTime: new Date(),
      withdrawRequestId: withdrawRequest.withdrawRequestId,
      status: TRANSACTION_STATUS.PUSHCASH
    },
    { transaction }
  )

  try {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Idempotency-Key': withdrawTransaction.transactionId,
      Authorization: `Bearer ${config.get('pushcash.api_key')}`
    }

    const createHandleOptions = {
      url: `${config.get('pushcash.base_url')}/intent`,
      method: 'POST',
      headers,
      data: {
        user_id: user.pushcashUserId,
        amount: Math.round(+withdrawRequest.amount * 100),
        currency: 'USD',
        direction: 'cash_out',
        approval_mode: 'manual',
        redirect_url: config.get('pushcash.redirect_url'),
        webhook_url: config.get('pushcash.withdraw_webhook_url')
      }
    }

    const { data: redeemData } = await axios(createHandleOptions)
    console.log('dataUrl', redeemData)

    return {
      ...redeemData,
      success: true
    }
  } catch (error) {
    console.log('errorrr', error)
    return this.addError('InternalServerErrorType', error)
  }
}
