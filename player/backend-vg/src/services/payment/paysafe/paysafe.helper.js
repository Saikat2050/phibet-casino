import axios from 'axios'
import { v4 as uuid } from 'uuid'
import db from '../../../db/models'
import config from '../../../configs/app.config'
import { times, minus, plus, round } from 'number-precision'
import {
  PAYMENT_METHOD,
  ROLE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE
} from '../../../utils/constants/constant'
import WalletEmitter from '../../../socket-resources/emitter/wallet.emitter'
import { InternalServerErrorType, MinimumBalanceErrorType } from '../../../utils/constants/errors'

export const generateAccessTokenPaysafe = () => {
  return `Basic ${Buffer.from(
   `${config.get('paysafe.username')}:${config.get('paysafe.password')}`
  ).toString('base64')}`
}

export const initPaymentPaysafe = async ({
  user,
  ipAddress,
  packageDetail,
  amount,
  promocodeDetail,
  transaction
}) => {
  const headers = {
    Simulator: 'EXTERNAL',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: generateAccessTokenPaysafe()
  }
  if (!user.paysafeCustomerId) {
    // Creating Paysafe User
    const [year, month, day] = user?.dateOfBirth?.split('-')

    const dateOfBirth = user?.dateOfBirth ? { year, month, day } : {}

    const createPaysafeCustomerIdOptions = {
      url: `${config.get('paysafe.base_url')}/v1/customers`,
      method: 'POST',
      headers,
      data: {
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
    }
    try {
      const { data: paysafeUser } = await axios(createPaysafeCustomerIdOptions)
      user.paysafeCustomerId = paysafeUser?.id
      await user.save()
    } catch (error) {
      console.log('errrorrrrrr', error?.response?.data)
    }
  }

  const transactionId = uuid()

  const moreDetails = {
    bonusSc: +round(+packageDetail.bonusSc, 2),
    bonusGc: +round(+packageDetail.bonusGc, 2),
    promocode: promocodeDetail
  }

  const moreDetailsString = JSON.stringify(moreDetails)

  const initiateTransaction = await db.TransactionBanking.create(
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
      paymentMethod: PAYMENT_METHOD.PAYSAFE,
      packageId: packageDetail.packageId,
      moreDetails: moreDetailsString
    },
    {
      transaction
    }
  )

  const options = {
    url: `${config.get('paysafe.base_url')}/v1/customers/${
      user.paysafeCustomerId
    }/singleusecustomertokens`,
    method: 'POST',
    headers,
    data: {
      merchantRefNum: initiateTransaction.transactionId,
      paymentType: [
        'neteller',
        'skrill',
        'paysafecard',
        'paysafecash',
        'instantach',
        'paypal',
        'card',
        'vippreferred',
        'sightline',
        'ach',
        'eft'
      ]
    }
  }
  try {
    const { data } = await axios(options)

    await db.TransactionBanking.update(
      {
        paymentTransactionId: data.id
      },
      {
        where: {
          transactionBankingId: initiateTransaction.transactionBankingId
        },
        transaction
      }
    )

    return {
      singleUseCustomerToken: data.singleUseCustomerToken,
      merchantRefNum: initiateTransaction.transactionId,
      amount: +times(+round(amount, 2), 100).toFixed(0)
    }
  } catch (error) {
    console.log(error.response.data)
    throw InternalServerErrorType
  }
}

export const initPayoutPaysafe = async ({
  user,
  amount,
  actionableEmail,
  transaction,
  paymentProvider,
  bankAccountId
}) => {
  const userWallet = await db.Wallet.findOne({
    where: { ownerId: user.userId },
    lock: { level: transaction.LOCK.UPDATE, of: db.Wallet },
    transaction
  })

  if (+amount > userWallet.scCoin.wsc) throw MinimumBalanceErrorType

  userWallet.scCoin = {
    ...userWallet.scCoin,
    wsc: +minus(+userWallet.scCoin.wsc, +amount).toFixed(2)
  }

  await userWallet.save({ transaction })

  WalletEmitter.emitUserWalletBalance(
    {
      scCoin: +plus(
        +userWallet.scCoin.bsc,
        +userWallet.scCoin.psc,
        +userWallet.scCoin.wsc
      ).toFixed(2),
      wsc: +(userWallet.scCoin.wsc).toFixed(2)
    },
    user.userId
  )

  await userWallet.save({ transaction })

  const withdrawRequest = await db.WithdrawRequest.create(
    {
      userId: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      amount,
      actionableEmail: paymentProvider === PAYMENT_METHOD.PAY_BY_BANK ? bankAccountId : actionableEmail,
      actionedAt: new Date(),
      paymentProvider: paymentProvider || PAYMENT_METHOD.PAYSAFE
    },
    { transaction }
  )
  await db.TransactionBanking.create(
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
      transactionType: TRANSACTION_TYPE.WITHDRAW,
      paymentMethod: paymentProvider || PAYMENT_METHOD.PAYSAFE,
      gcCoin: 0,
      scCoin: amount,
      transactionDateTime: new Date(),
      withdrawRequestId: withdrawRequest.withdrawRequestId
    },
    { transaction }
  )
}
