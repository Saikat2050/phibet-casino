import { aleaCasinoConfig } from '@src/configs/casinoproviders/alea.config'
import crypto from 'crypto'

export const aleaVerifySignature = (req, res, next) => {
  const { signature, stringData, type, ...request } = { ...req.body, ...req.query }

  const generateSignatureString = () => {
    if (type === 'BALANCE') {
      const { casinoSessionId, currency, gameId, integratorId, softwareId } = request
      return `${casinoSessionId}${currency}${gameId}${integratorId}${softwareId}${aleaCasinoConfig.secretKey}`
    }
    return `${stringData}${aleaCasinoConfig.secretKey}`
  }

  const sign = `SHA-512=${crypto
        .createHash('sha512')
        .update(generateSignatureString())
        .digest('hex')}`

  return sign === signature
}
