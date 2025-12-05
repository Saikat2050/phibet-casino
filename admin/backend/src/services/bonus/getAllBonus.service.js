import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string' },
    language: { type: 'string' },
    bonusType: { enum: Object.values(BONUS_TYPES) },
    isActive: { type: 'boolean' },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 },
    tagIds: { type: 'string' }
  }
})

export class GetAllBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, bonusType, search, isActive, perPage, tagIds } = this.args
    const where = {}
    try {
      if (bonusType) where.bonusType = bonusType
      if (_.isBoolean(isActive)) where.isActive = isActive
      if (search) where.promotionTitle = { EN: { [Op.iLike]: `%${search}%` } }
      if (tagIds) where.tagIds = { [Op.overlap]: tagIds.split(',') }
      const bonus = await this.context.sequelize.models.bonus.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where,
        limit: perPage,
        offset: (page - 1) * perPage
      })
      return { bonus: bonus.rows, page, totalPages: Math.ceil(bonus.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
