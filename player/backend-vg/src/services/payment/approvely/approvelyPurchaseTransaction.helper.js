import axios from 'axios'
import config from '../../../configs/app.config'
import { v4 as uuid } from 'uuid'
import db from '../../../db/models'
import { PAYMENT_METHOD, ROLE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../../utils/constants/constant'
import { times, round } from 'number-precision'
import { InternalServerErrorType } from '../../../utils/constants/errors'
export const approvelyPurchaseTransaction = async ({
  user,
  ipAddress,
  packageDetail,
  amount,
  promocodeDetail,
  transaction,
  token
}) => {
  const transactionId = uuid()
  const approvelyTransacionRequest = {
    url: `${config.get('approvely.base_url')}/api/checkout/link`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-coinflow-auth-user-id': user?.userId + '',
      Authorization: `${config.get('approvely.privateApiKey')}`
    },
    data: {
      user: user?.email,
      customerInfo: {
        name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        verificationId: user?.userId + '',
        address: user?.addressLine_1,
        city: user?.city,
        state: user?.state,
        ip: ipAddress
      },
      chargebackProtectionData: [{ productName: 'package', productType: 'topUp', quantity: 1, rawProductData: { pakageId: packageDetail?.packageId + '', amount: packageDetail?.amount + '', gcCoin: packageDetail?.gcCoin + '', scCoin: packageDetail?.scCoin + '' } }],
      settlementType: 'USDC',
      subtotal: { cents: times(+amount, 100) },
      origin: [`${config.get('frontendUrl')}`],
      webhookInfo: {
        ...packageDetail,
        transactionId
      }
    }
  }
  try {
    const response = await axios(approvelyTransacionRequest)
    if (!response.data) {
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
        paymentMethod: PAYMENT_METHOD.APPROVELY,
        packageId: packageDetail.packageId,
        moreDetails: moreDetailsString
      },
      {
        transaction
      }
    )
    return { ...response.data, transactionId: initiatedTransaction?.transactionId }
  } catch (error) {
    console.log(error.response.data)
    throw InternalServerErrorType
  }
}
