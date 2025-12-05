import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'

// Define constraints using AJV
const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'number' }
  },
  required: ['id']
})

export class GetVipTiersDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { id } = this.args
    try {
      const vipTier = await this.context.sequelize.models.vipTier.findOne({ where: { id } })
      if (!vipTier) return this.addError('VipTierDoesNotExistsErrorType')

      return vipTier
    } catch (error) {
      throw new APIError(error)
    }
  }
}
