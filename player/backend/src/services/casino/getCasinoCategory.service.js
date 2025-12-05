import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { GetIpLocationService } from '../common/getIpLocation.service'
import { Op, literal } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    isSidebar: { type: 'string' },
    ipAddress: { type: 'string' },
    isLobbyPage: { type: 'string' },
    stateCode: { type: ['string', 'null'] }
  },
  required: []
})

export class GetCasinoCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { isSidebar, isLobbyPage, stateCode } = this.args
    let stateId

    try {
      const where = { isActive: true }
      if (isSidebar === 'true') where.isSidebar = true
      if (isLobbyPage === 'true') where.isLobbyPage = true

      const { result: { state } } = await GetIpLocationService.execute({ ipAddress: this.args.ipAddress }, this.context)
      if (stateCode) {
        const state = await this.context.sequelize.models.state.findOne({ where: { code: stateCode, isActive: true }, attributes: ['id'], raw: true })
        stateId = state?.id
      }

      const casinoCategories = await this.context.sequelize.models.casinoCategory.findAll({
        where,
        order: [['order_id', 'asc']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include:
        {
          model: this.context.sequelize.models.casinoGame,
          where: {
            isActive: true,
            [Op.not]: literal(`
                      NOT EXISTS (
                        SELECT 1
                        FROM jsonb_array_elements_text("casinoGames"."restricted_states") AS value
                        WHERE value::int = ${stateId || state?.id || 0}
                      )
                    `)
          },
          attributes: [],
          required: true,
          include: {
            model: this.context.sequelize.models.casinoProvider,
            where: {
              isActive: true,
              [Op.not]: literal(`
                      NOT EXISTS (
                        SELECT 1
                        FROM jsonb_array_elements_text("casinoGames->casinoProvider"."restricted_states") AS value
                        WHERE value::int = ${stateId || state?.id || 0}
                      )
                    `)
            },
            attributes: [],
            include: {
              attributes: [],
              model: this.context.sequelize.models.casinoAggregator,
              where: { isActive: true },
              required: true
            },
            required: true
          }
        }
      })

      return {
        casinoCategories
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
