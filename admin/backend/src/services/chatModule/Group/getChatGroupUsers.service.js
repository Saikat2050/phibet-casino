import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { APIError } from '@src/errors/api.error'
const dayjs = require('dayjs')

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    chatGroupId: { type: 'string' },
    banFilter: { enum: ['all', 'ban', 'unban'] },
    userId: { type: 'number' }
  },
  required: ['chatGroupId']
})

export default class GetChatGroupUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const UserModel = this.context.sequelize.models.user
    const UserChatGroupModel = this.context.sequelize.models.userChatGroup
    const transaction = this.context.sequelizeTransaction

    try {
      const { perPage, page, chatGroupId, search, userId, banFilter } = this.args
      let query = {}

      if (search) query = { ...query, [Op.or]: { firstName: { [Op.iLike]: `${search}%` }, lastName: { [Op.iLike]: `${search}%` } } }
      if (userId) query = { ...query, userId: { [Op.not]: userId } }

      let chatGroupSearch = { chatGroupId }
      if (banFilter === 'ban') chatGroupSearch.bannedTill = { [Op.gt]: dayjs().format() }
      else if (banFilter === 'unban') {
        chatGroupSearch = {
          chatGroupId,
          [Op.or]: [{
            bannedTill: { [Op.lt]: dayjs().format() }
          }, { bannedTill: null }]
        }
      }

      // get all groups
      const allUsers = await UserModel.findAndCountAll({
        where: query,
        attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'
        ],
        include: [{
          model: UserChatGroupModel,
          where: chatGroupSearch,
          required: true,
          attributes: ['id', 'chatGroupId',
            [
              this.context.sequelize.literal(`
                CASE WHEN "banned_till" > NOW() THEN TRUE ELSE FALSE END
              `),
              'isBanned'
            ]
          ]
        }],
        transaction,
        order: [['createdAt', 'DESC']],
        limit: perPage,
        offset: ((page - 1) * perPage)
      })

      return { count: allUsers.count, users: allUsers.rows, page, totalPages: Math.ceil(allUsers.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
