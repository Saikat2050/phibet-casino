import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import axios from 'axios'
import { approvelyPaymentGateWay } from '@src/configs/payment/approvely.config'
import { Logger } from '@src/libs/logger'

const constraints = ajv.compile({
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id']
})

export class ApprovelyOverrideChargebackService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const getRequest = async (endpoint, headers) => {
        const res = await axios.get(`${approvelyPaymentGateWay.url}${endpoint}`, { headers })
        return res.data || null
      }

      const sessionKeyData = await getRequest('/api/auth/session-key', {
        Authorization: `${approvelyPaymentGateWay.privateApiKey}`,
        accept: 'application/json',
        'x-coinflow-auth-user-id': this.args.id
      })
      if (!sessionKeyData?.key) return

      const customerData = await getRequest('/api/customer/v2', {
        accept: 'application/json',
        'x-coinflow-auth-session-key': sessionKeyData.key
      })
      if (!customerData?.customer?._id) return

      const approvelyResponse = await axios.put(`${approvelyPaymentGateWay.url}/api/merchant/${customerData.customer._id}/protection`,
        { protectionEnabled: false },
        { headers: { Authorization: `${approvelyPaymentGateWay.privateApiKey}`, 'Content-Type': 'application/json' } }
      )
      Logger.info(`-------Approvely Override Chargeback response-----${approvelyResponse.status}--`)
    } catch (error) {
      Logger.error(`Error in Approvely Override Chargeback Protection request - ${error}`)
    }
  }
}
