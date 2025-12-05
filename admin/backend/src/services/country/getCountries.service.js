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

export class GetCountriesService extends ServiceBase {
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
          Sequelize.where(Sequelize.cast(Sequelize.col('country.code'), 'text'), 'ilike', `%${searchString}%`)
        ]
      }

      const countries = await this.context.sequelize.models.country.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        include: {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.sequelize.models.language
        },
        ...(page && perPage ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        order: [[this.args.orderBy, this.args.order]]
      })
      return { countries: countries.rows, page, totalPages: Math.ceil(countries.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
