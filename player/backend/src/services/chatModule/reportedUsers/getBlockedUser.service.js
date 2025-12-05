import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { omitBy, isNil } from 'lodash'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'

const schema = {
  type: 'object',
  properties: {
    perPage: { type: 'string', default: 15 },
    page: { type: 'string', default: 1 },
    search: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    id: { type: 'string' }
  }
}

const constraints = ajv.compile(schema)

export class GetBlockedUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ReportedUserModel = this.context.sequelize.models.reportedUser
    const UserModel = this.context.sequelize.models.user

    const userId = this.args.userId

    const { perPage, page, search, fromDate, toDate } = this.args
    const whereCondition = {
      description: (search)
        ? {
            [Op.iLike]: `%${search}%`
          }
        : null,
      actioneeId: userId,
      isUnblocked: false
    }
    if (fromDate || toDate) whereCondition.createdAt = alignDatabaseDateFilter(fromDate, toDate)

    const filterCondition = omitBy(whereCondition, isNil)
    try {
      const reportedUser = await ReportedUserModel.findAndCountAll({
        where: filterCondition,
        include: [
          { model: UserModel, as: 'reportedUsers', attributes: ['email', 'firstName', 'lastName', 'username', 'imageUrl'] }
        ],
        order: [['id', 'desc']],
        limit: perPage,
        offset: ((page - 1) * perPage),
        transaction: this.context.sequelizeTransaction
      })
      return { reportedUser: reportedUser.rows, page, totalPages: Math.ceil(reportedUser.count / perPage) }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
