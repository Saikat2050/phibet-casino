import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
const dayjs = require('dayjs')

const constraints = ajv.compile({
  type: 'object',
  properties: {
    chatGroupId: { type: 'string' },
    userId: { type: 'number' },
    ban: { type: 'boolean', default: true }
  },
  required: ['chatGroupId']
})

export default class BanGroupUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const UserChatGroupModel = this.context.sequelize.models.userChatGroup
    const transaction = this.context.sequelizeTransaction

    try {
      const { chatGroupId, userId, ban } = this.args
      let bannedTill = null

      if (ban) { bannedTill = dayjs().add(ban, 'year').format() }
      await UserChatGroupModel.update({ bannedTill }, { where: { userId, chatGroupId }, transaction })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
