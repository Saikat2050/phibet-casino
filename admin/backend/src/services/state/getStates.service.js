import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    isActive: { type: 'boolean' },
    languageId: { type: 'string' },
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500 },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'code', 'name', 'isActive'], default: 'id' }
  }
})

export class GetStatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const page = this.args.page
    const perPage = this.args.perPage
    const isActive = this.args.isActive
    const languageId = this.args.languageId
    const searchString = this.args.searchString

    try {
      const where = {}
      if (isActive) where.isActive = isActive
      if (languageId) where.languageId = languageId
      if (searchString) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${searchString}%` } },
          Sequelize.where(Sequelize.cast(Sequelize.col('state.code'), 'text'), 'ilike', `%${searchString}%`)
        ]
      }

      const states = await this.context.sequelize.models.state.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        ...(page && perPage ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        order: [[this.args.orderBy, this.args.order]]
      })
      return { states: states.rows, page, totalPages: Math.ceil(states.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
