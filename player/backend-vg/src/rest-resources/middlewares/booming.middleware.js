
import crypto from 'crypto'
import config from '../../configs/app.config'
import { SignatureMismatchErrorType } from '../../utils/constants/errors'

export default async function boomingAuthMiddleware (req, res, next) {
  const { 
    headers: {
      'bg-nonce': nonce,
      'bg-signature': signature
    }
  } = req

  const { boomingApiSecret, boomingCallback, boomingRollBackCallback } = config.getProperties().boomingConfig

  const callback = req.url === '/betWinLose' ? boomingCallback : boomingRollBackCallback

  const requestBody = req.rawBody.toString('utf-8').replace(/\s/g, '')
  const bodyHash = crypto.createHash('sha256').update(requestBody).digest('hex')
  const reqPayload = callback + nonce + bodyHash

  const sign = crypto.createHmac('sha512', boomingApiSecret).update(reqPayload).digest('hex')

  if (signature !== sign) next(SignatureMismatchErrorType)

  next()
}