
import { createApplePaySession } from '../../../helpers/finix'
import ServiceBase from '../../serviceBase'
// import { sequelize } from '../../../db/models'
// import WalletEmitter from '../../../socket-resources/emmitter/wallet.emmitter'
import config from '../../../configs/app.config'
/**
 * @Service Create Payment Instrument
 * Used to create -
 * 1. Payment instrument
 * 2. Do the payment
 * 3. Detect Fradulent Behaviour
 * @args {token, type, identity, fraud_session_id, amount, packageId}
 * @returns {status, message}
 */

export default class CreateApplePaySession extends ServiceBase {
  async run () {
    const {
      validationUrl
    } = this.args
      const { detail } = this.context.req.user
    const extraHeaders = {
      'User-Id': detail.userId
    }
    try {
          const sessionPayload = {
          display_name: 'Vegas Coins',
          domain: config.get('finix.domain'),
          validation_url: validationUrl,
          merchant_identity: config.get('finix.merchantId')
        }
const sessionData = await createApplePaySession(sessionPayload,extraHeaders)
   console.log("Session Data ??????????????????????????/ ", sessionData)
      return {
        sessionData,
        success: true
      }
    } catch (e) {
     return {
        success: false
      }
  }
  }
}