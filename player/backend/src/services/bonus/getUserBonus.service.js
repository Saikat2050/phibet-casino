import { sequelize } from '@src/database/models'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BONUS_TYPES, USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    bonusType: { enum: Object.values(BONUS_TYPES) },
    status: { enum: Object.values(USER_BONUS_STATUS_VALUES) },
    page: { type: 'string', default: 1 },
    perPage: { type: 'string', default: 10 }
  }
})

export class GetUserBonusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, perPage, userId, status, bonusType } = this.args
    const where = { userId }
    try {
      if (status) where.status = status
      const userBonus = await sequelize.models.userBonus.findAndCountAll({
        where,
        include: {
          model: sequelize.models.bonus,
          as: 'bonus',  // 👈 must match the alias above
          attributes: ['id', 'promotionTitle', 'bonusType'],
          where: bonusType ? { bonusType } : {}
        },
        limit: perPage,
        offset: ((page - 1) * perPage)
      })

      if (!userBonus) return this.addError('UserBonusNotFoundErrorType')

      return { userBonus: userBonus.rows, page, totalPages: Math.ceil(userBonus.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
