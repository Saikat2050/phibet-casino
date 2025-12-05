import { APIError } from '@src/errors/api.error'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { KYC_STATUS, USER_GENDER } from '@src/utils/constants/public.constants.utils'
import _ from 'lodash'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    userId: { type: 'string' },
    uuid: { type: 'string' },
    kycStatus: { type: ['string', 'null'] },
    languageId: { type: 'string' },
    dateOfBirth: { type: 'string' },
    searchString: { type: 'string' },
    loggedIn: { type: 'boolean' },
    isActive: { type: 'boolean' },
    countryId: { type: 'string' },
    // tagId: { type: 'string' },
    gender: { enum: Object.values(USER_GENDER) },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'username', 'email', 'phone', 'dateOfBirth', 'createdAt', 'uniqueId'], default: 'id' },
    tagIds: { type: 'string' },
    phoneVerified: { type: 'boolean'},
    emailVerified: { type: 'boolean'}
  }
})

export class GetPlayersService extends ServiceBase {
  get constraints() {
    return constraints
  }

  async run() {
    const kycStatus = this.args?.kycStatus
    const phoneVerified = this.args?.phoneVerified
    const emailVerified = this.args?.emailVerified
    const languageId = this.args.languageId
    const dateOfBirth = this.args.dateOfBirth
    const searchString = this.args.searchString
    const loggedIn = this.args.loggedIn
    const isActive = this.args.isActive
    const gender = this.args.gender
    const page = this.args.page
    const perPage = this.args.perPage
    const userId = this.args.userId
    const uuid = this.args.uuid
    const countryId = this.args.countryId
    // const tagId = this.args.tagId
    const fromDate = this.args.fromDate
    const toDate = this.args.toDate
    const tagIds = this.args.tagIds
    try {
      const where = {}

      if (userId) where.id = userId
      if (languageId) where.languageId = languageId
      if (dateOfBirth) where.dateOfBirth = dateOfBirth
      if (_.isBoolean(loggedIn)) where.loggedIn = loggedIn
      if (_.isBoolean(isActive)) where.isActive = isActive
      if (_.isBoolean(phoneVerified)) where.phoneVerified = phoneVerified
      if (_.isBoolean(emailVerified)) where.emailVerified = emailVerified
      if (kycStatus) {
        if (kycStatus === KYC_STATUS.PENDING) where.kycStatus = { [Op.notIn]: [KYC_STATUS.COMPLETED, KYC_STATUS.PROCESSING] }
        else where.kycStatus = kycStatus
      }
      if (countryId) where.countryId = countryId
      if (gender) where.gender = gender
      if (searchString) {
        const finalSearchString = `%${searchString}%`
        where[Op.or] = [
          Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'iLike', finalSearchString),
          { username: { [Op.iLike]: finalSearchString } },
          { email: { [Op.iLike]: finalSearchString } },
          { phone: { [Op.iLike]: finalSearchString } },
          { uniqueId: { [Op.iLike]: finalSearchString } }
        ]
      }
      if (fromDate || toDate) {
        const dateFilter = alignDatabaseDateFilter(fromDate, toDate)
        where.createdAt = dateFilter
      }
      let whereTag
      if (tagIds) whereTag = { tagId: { [Op.in]: tagIds.split(',') } }
      const include = [{
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        model: this.context.sequelize.models.country
      }, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        model: this.context.sequelize.models.userTag,
        where: whereTag
      }]
      const users = await this.context.sequelize.models.user.findAndCountAll({
        attributes: { exclude: ['updatedAt', 'password'] },
        where,
        include: include,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]]
      })

      return { users: users.rows, page, totalPages: Math.ceil(users.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
