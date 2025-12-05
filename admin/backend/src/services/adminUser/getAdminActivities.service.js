import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { allCategories } from '@src/utils/constants/adminActivityCategories.constants'
import { Logger } from '@src/libs/logger'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    category: { type: 'string', enum: allCategories },
    actionType: { type: 'string', enum: ['create', 'update', 'delete'] },
    playerUserName: { type: 'string' },
    adminId: { type: 'string' },
    page: { type: 'number', minimum: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500 },
    fromDate: { type: 'string' },
    toDate: { type: 'string' }
  },
  required: ['adminUserId']
})

export class GetAdminActivitiesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { adminId, category, actionType, playerUserName, page, perPage, fromDate, toDate } = this.args
    const where = {}
    const include = []
    try {
      if (adminId) {
        where.adminUserId = adminId
      }
      if (category) {
        where.category = category
      }
      if (actionType) {
        where.action = actionType
      }
      if (fromDate || toDate) {
        const dateFilter = alignDatabaseDateFilter(fromDate, toDate)
        where.createdAt = dateFilter
      }
      if (playerUserName) {
        const playerIds = await this.context.sequelize.models.user.findAll({
          attributes: ['id'],
          where: { username: { [Op.iLike]: `%${playerUserName}%` } },
          raw: true
        })

        const playerIdsArray = playerIds.map((playerId) => {
          return playerId.id
        })
        where.changeTableId = playerIdsArray
        include.push([this.context.sequelize.literal('(SELECT username FROM "users" WHERE "users"."id" = "adminActivity"."change_table_id")'), 'username'])
      }
      Logger.info(`where: ${JSON.stringify(where)}`)
      const adminActivities = await this.context.sequelize.models.adminActivity.findAndCountAll({
        include,
        where,
        ...((page && perPage) ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        order: [['updatedAt', 'DESC']]
      })

      return { adminActivities: adminActivities.rows, page, totalPages: Math.ceil(adminActivities.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
