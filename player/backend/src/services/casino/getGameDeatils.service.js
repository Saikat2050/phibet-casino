import { APIError } from '@src/errors/api.error'
import ServiceBase from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' }
  }
})

export class GetCasinoGameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const game = await this.context.sequelize.models.casinoGame.findOne({
        where: { id: this.args.id },
        include: [{
          attributes: ['id', 'name', 'iconUrl'],
          model: this.context.sequelize.models.casinoProvider,
          required: true,
          include: {
            attributes: [],
            model: this.context.sequelize.models.casinoAggregator,
            where: { isActive: true },
            required: true
          }
        }, {
          attributes: ['id', 'casinoCategoryId', 'casinoGameId'],
          model: this.context.sequelize.models.casinoGameCategory,
          include: [{
            model: this.context.sequelize.models.casinoCategory,
            where: { isActive: true },
            attributes: ['name'],
            required: true
          }],
          required: true
        }]
      })
      return { game }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
