import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string' },
    page: { type: 'string' },
    perPage: { type: 'string' },
    depositAllowed: { type: ['string', 'null'], enum: ['true', 'false', 'null', ''] },
    withdrawAllowed: { type: ['string', 'null'], enum: ['true', 'false', 'null', ''] }
  }
})

export class GetPaymentProvidersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, search, depositAllowed, withdrawAllowed, perPage } = this.args
    const where = {}

    try {
      if (depositAllowed) where.depositAllowed = depositAllowed
      if (withdrawAllowed) where.withdrawAllowed = withdrawAllowed
      if (search) where.name = { EN: { [Op.iLike]: `%${search}%` } }

      const paymentProviders = await this.context.sequelize.models.paymentProvider.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['createdAt', 'DESC']]
      })

      return { paymentProviders: paymentProviders.rows, page, totalPages: Math.ceil(paymentProviders.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
