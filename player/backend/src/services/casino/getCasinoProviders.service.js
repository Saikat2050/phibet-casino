import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GetIpLocationService } from '@src/services/common/getIpLocation.service'
import { Op, literal } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    ipAddress: { type: 'string' }
  },
  required: ['ipAddress']
})

export class GetCasinoProvidersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { ipAddress } = this.args
      const { result: { state } } = await GetIpLocationService.execute({ ipAddress: ipAddress }, this.context)

      const providers = await this.context.sequelize.models.casinoProvider.findAll({
        order: [['orderId', 'ASC']],
        attributes: ['id', 'name', 'iconUrl'],
        where: {
          isActive: true,
          // restrictedStates: { [Op.not]: { [Op.contains]: [state?.code] } }
          [Op.not]: literal(`
            NOT EXISTS (
              SELECT 1
              FROM jsonb_array_elements_text("casinoProvider"."restricted_states") AS value
              WHERE value::int = ${state?.id || 0}
            )
          `)
        },
        include: {
          attributes: [],
          model: this.context.sequelize.models.casinoAggregator,
          where: { isActive: true },
          required: true
        }
      })

      return { providers }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
