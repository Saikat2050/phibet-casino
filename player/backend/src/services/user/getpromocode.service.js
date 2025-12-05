import { Op } from 'sequelize'
import ServiceBase from '@src/libs/serviceBase'
import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '@src/utils/constants/public.constants.utils'
import { pageValidation } from '@src/utils/common'

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
    const PromocodeModel = this.context.sequelize.models.promocode

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
