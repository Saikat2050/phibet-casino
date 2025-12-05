import config from '../../../configs/app.config'
import AxiosHelper from '../../../helpers/axios.helper'
import { FINIX_PROVIDERS } from '../../../utils/constants/constant'
import ServiceBase from '../../serviceBase'
import ajv from '../../../libs/ajv'

const schema = {
  type: 'object',
  properties: {
    provider: { type: ['string', 'null'] },
    validation_url: { type: ['string', 'null'] },
    merchant_identity: { type: ['string', 'null'] },
    domain: { type: ['string', 'null'] },
    display_name: { type: ['string', 'null'] }
  },
  required: ['validation_url', 'merchant_identity', 'display_name']
}

const constraints = ajv.compile(schema)

export default class ApplePaySessionsService extends ServiceBase {
  get constraints() {
    return constraints()
  }

  async run() {
    const { provider, validation_url, merchant_identity, domain, display_name } = this.args

    try {
      const baseUrl = config.get('finix.apple_pay_session_base_url')
      const axiosHelper = new AxiosHelper({
        baseUrl
      })

      const userName = config.get('finix.username')
      const userPassword = config.get('finix.password')
      const base64 = Buffer.from(`${userName}:${userPassword}`).toString('base64')
      const headers = {
        'Content-Type': 'application/json',
        'Finix-Version': '2022-02-01',
        Authorization: 'Basic ' + base64
      }
      const data = {
        provider: provider ?? FINIX_PROVIDERS.APPLE_PAY,
        validation_url,
        merchant_identity,
        domain: domain ?? config.get(frontendUrl),
        display_name
      }

      const applePaySession = await axiosHelper.request({
        endPoint: config.get('finix.apple_pay_session_endpoint'),
        method: 'POST',
        headers,
        data
      })

      return {
        sessionData: applePaySession,
        success: true
      }
    } catch (e) {
      console.log('ERROR IN APPLE PAY SESSION', e)
      return {
        success: false
      }
    }
  }
}
