import { Op } from 'sequelize'
import { pageValidation } from '../../utils/common'
import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ajv from '../../libs/ajv'

const schema = {
  type: 'object',
  properties: {
    limit: {
      type: ['string', 'null']
    },
    page: {
      type: ['string', 'null']
    },
    promocode: {
      type: ['string', 'null']
    }
  },
  required: []
}

const constraints = ajv.compile(schema)

export class GetPromocodeDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { Promocode: PromocodeModel }
    } = this.context

    const { page, limit, promocode } = this.args

    try {
      const { pageNo, size } = pageValidation(page, limit)
      let query = { isActive: true }

      if (promocode) query = { ...query, promocode: { [Op.iLike]: `%${promocode}%` } }

      query = {
        ...query,
        [Op.or]: [
          { validTill: { [Op.gte]: new Date(Date.now()) } },
          { validTill: { [Op.is]: null } }
        ]
      }

      const promocodeDetail = await PromocodeModel.findAndCountAll({
        where: query,
        offset: (pageNo - 1) * size,
        limit: size,
        order: [['createdAt', 'DESC']]
      })

      promocodeDetail.rows = promocodeDetail.rows.map(promocode => ({
        ...promocode.get(),
        maxUsersAvailed: +promocode.maxUsersAvailed,
        perUserLimit: +promocode.perUserLimit
      }))

      return {
        success: true,
        promocodeDetail,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
