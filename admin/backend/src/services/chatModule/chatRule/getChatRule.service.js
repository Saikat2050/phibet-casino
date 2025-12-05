import { ServiceBase } from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import { Op } from 'sequelize'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 }
  }
})

export default class GetChatRuleService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ChatRuleModel = this.context.sequelize.models.chatRule
    //const transaction = this.context.sequelizeTransaction

    const { page, perPage, search } = this.args
    const whereCondition = (search) ? { rules: { [Op.iLike]: `%\\${search}%` } } : {}
    try {
      const chatRules = await ChatRuleModel.findAndCountAll({
        where: whereCondition,
        limit: perPage,
        offset: ((page - 1) * perPage),
      })
      return { chatRules: chatRules.rows, page, totalPages: Math.ceil(chatRules.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
