import { APIError } from '@src/errors/api.error'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import ajv from '@src/libs/ajv'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import { pageValidation } from '@src/helpers/common.helper'
const schema = {
  type: 'object',
  properties: {
    limit: {
      type: ['string', 'null']
    },
    pageNo: {
      type: ['string', 'null']
    },
    promocode: {
      type: ['string', 'null']
    },
    isActive: {
      type: ['string', 'null']
    },
    id: {
      type: ['string', 'null']
    },
    orderBy: {
      type: ['string', 'null']
    },
    sort: {
      type: ['string', 'null']
    }
  },
  required: []
}
const constraints = ajv.compile(schema)

export class GetPromoCodeDetails extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { promocode: promoCodeModel, userActivity: userActivityModel } = this.context.sequelize.models
console.log("working till here promocode")
    const { pageNo=1, limit=10, promocode, isActive, id, orderBy, sort } = this.args

    try {
console.log("working till here promocode 01")

      const { page, size } = pageValidation(pageNo, limit)
      let query = {}
console.log("working till here promocode 001")

      if (id) query = { ...query, id: id }
console.log("working till here promocod1 0002")

      if (promocode) query = { promocode: { [Op.iLike]: `%${promocode}%` } }
console.log("working till here promocode 00003")

      if (isActive) query = { ...query, isActive }
console.log("working till here promocode 2")

      const promocodeDetail = await promoCodeModel.findAndCountAll({
        where: query,
        offset: (page - 1) * size,
        limit: size,
        order: [[orderBy || 'createdAt', sort || 'DESC']]
      })

      promocodeDetail.rows = await Promise.all(
        promocodeDetail.rows.map(async (promocode) => {
          const maxUsersAvailedCount = await userActivityModel.count({
            where: { promocodeId: promocode.id }
          })
          console.log("working till here promocode 3")

          return {
            ...promocode.get(),
            maxUsersAvailed: promocode.maxUsersAvailed,
            perUserLimit: +promocode.perUserLimit,
            maxUsersAvailedCount: maxUsersAvailedCount
          }
        })
      )

      return {
        success: true,
        promocodeDetail,
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
