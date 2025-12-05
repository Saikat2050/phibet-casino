import config from '../../../configs/app.config'
import AxiosHelper from '../../../helpers/axios.helper'
import ServiceBase from '../../serviceBase'

export default class ApplePayIdentityService extends ServiceBase {
  async run() {
    try {
      const baseUrl = config.get('finix.merchant_api')
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

      const applePayMerchantInfo = await axiosHelper.request({
        endPoint: config.get('finix.merchantId'),
        headers,
      })

      return {
        sessionData: applePayMerchantInfo,
        identity: applePayMerchantInfo?.identity,
        success: true
      }
    } catch (e) {
      console.log('ERROR IN APPLE PAY MERCHANT INFO', e)
      return {
        success: false
      }
    }
  }
}
