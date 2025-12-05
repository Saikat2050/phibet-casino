import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: ['string'] },
    searchString: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  },
  required: ['userId']
})

export class GetReferralUserDetails extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { searchString, page, perPage, userId } = this.args
      let where
      if (searchString) {
        where = { referredBy: userId, [Op.or]: [{ email: { [Op.like]: `%${searchString}%` } }, { username: { [Op.like]: `%${searchString}%` } }] }
      } else where = { referredBy: userId }

      const referredUser = await this.context.sequelize.models.user.findAndCountAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'lastLoggedInIp', 'loggedInAt', 'publicAddress'] },
        where: where,
        limit: perPage,
        offset: (page - 1) * perPage
      })

      return { referredUser: referredUser.rows, page, totalPages: Math.ceil(referredUser.count / perPage) }
    } catch (err) {
      this.addError('InternalServerErrorType', err)
    }
  }
}
