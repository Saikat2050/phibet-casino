import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    isDefault: { type: 'boolean' },
    isActive: { type: 'boolean' },
    searchString: { type: 'string' },
    type: { enum: Object.values(CURRENCY_TYPES) },
    page: { type: 'number', minimum: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500 },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'code', 'name', 'exchangeRate', 'type', 'default', 'isActive'], default: 'id' }
  }
})

export class GetCurrenciesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const type = this.args.type
    const isDefault = this.args.isDefault
    const isActive = this.args.isActive
    const page = this.args.page
    const perPage = this.args.perPage
    const searchString = this.args.searchString

    try {
      const where = {}
      if (type) where.type = type
      if (isActive) where.isActive = isActive
      if (isDefault) where.default = isDefault
      if (searchString) where[Op.or] = [{ name: { [Op.like]: `%${searchString}%` } }, { code: { [Op.like]: `%${searchString}%` } }]

      const currencies = await sequelize.models.currency.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        ...(page && perPage ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        order: [[this.args.orderBy, this.args.order]]
      })

      return { currencies: currencies.rows, page, totalPages: Math.ceil(currencies.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
