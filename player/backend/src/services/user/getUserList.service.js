import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import _ from 'lodash'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    perPage: { type: 'string', default: 15 },
    page: { type: 'string', default: 1 },
    search: { type: 'string' },
    userId: { type: 'number' },
    chatGroupId: { type: 'string' },
    isActive: { type: 'boolean' }
  }
})

export class GetAllUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const UserModel = this.context.sequelize.models.user
    const UserChatGroupModel = this.context.sequelize.models.userChatGroup

    const { page, perPage, search, isActive, userId, chatGroupId } = this.args

    const whereCondition = {
      ...((search)
        ? { username: { [Op.iLike]: `%${search}%` } }
        : {}),
      ...((userId)
        ? { id: { [Op.not]: userId } }
        : {}),
      isActive: isActive
    }

    const filterUsers = _.omitBy(whereCondition, _.isNil)
    const allUsers = await UserModel.findAndCountAll({
      where: filterUsers,
      attributes: ['id', 'username'],
      include: [{
        model: UserChatGroupModel,
        where: { chatGroupId },
        required: true,
        attributes: []
      }],
      limit: perPage,
      offset: ((page - 1) * perPage),
      order: [['username', 'ASC']],
      transaction: this.context.sequelizeTransaction
    })

    return { allUsers: allUsers.rows, page, totalPages: Math.ceil(allUsers.count / perPage) }
  }
}
