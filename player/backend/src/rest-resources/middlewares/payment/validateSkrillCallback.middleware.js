import { errorTypes } from '@src/utils/constants/error.constants'
import crypto from 'crypto'
import { skrillPaymentGateWay } from '@src/configs'

/**
 * @type {import('express').RequestHandler}
 */
export async function validateSkrillCallback (req, _, next) {
  try {
    const data = req.body
    const stringToHash = `${data.merchant_id}${data.transaction_id}${skrillPaymentGateWay.secretKey}${data.mb_amount}${data.mb_currency}${data.status}`
    const md5Signature = crypto
      .createHash('md5')
      .update(stringToHash)
      .digest('hex')
      .toUpperCase()
    if (data.md5sig !== md5Signature) return next(errorTypes.BlockedTransactionErrorType)
    next()
  } catch (error) {
    next(error)
  }
}
