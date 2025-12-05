import { config } from '@src/configs/config'
import ajv from '@src/libs/ajv'
import { Logger } from '@src/libs/logger'
import ServiceBase from '@src/libs/serviceBase'
import axios from 'axios'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    affiliateCode: { type: 'string' },
    affiliateId: { type: 'string' }
  },
  required: ['affiliateCode', 'affiliateId']
})

export class GetScaleoAffiliateDetailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { affiliateCode, affiliateId } = this.args

    try {
      const userData = await this.context.sequelize.models.user.findOne({ attributes: ['id'], where: { affiliateCode } })
      if (userData) return this.addError('ClickIdAlreadyInUseErrorType')

      const options = {
        url: `${config.get('scaleo.base_url')}/api/v2/network/affiliates/${affiliateId}`,
        method: 'GET',
        params: { 'api-key': config.get('scaleo.api_key') }
      }

      const { data } = await axios(options)
      // Status = 1 - Active, 2 - Pending, 3 - Inactive
      if (
        data.code === 200 &&
        data.info?.affiliate?.status === 1 &&
        +data.info?.affiliate?.id === +affiliateId
      ) {
        return { success: true }
      } else return { success: false }
    } catch (error) {
      Logger.error(`Get Scaleo Affiliate Detail Service Error - ${error}`)
      return { success: false }
    }
  }
}
