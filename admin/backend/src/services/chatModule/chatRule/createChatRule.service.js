import { ServiceBase } from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import ajv from '@src/libs/ajv'
import { APIError } from '@src/errors/api.error'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    rule: { type: 'string' }
  },
  required: ['rule']
})
export default class CreateChatRuleService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ChatRuleModel = this.context.sequelize.models.chatRule
    const transaction = this.context.sequelizeTransaction

    const { rule } = this.args
    try {
      const newChatRules = await ChatRuleModel.create({ rules: rule }, { transaction })
      return { message: SUCCESS_MSG.CREATE_SUCCESS, newChatRules }
    } catch (e) {
      throw new APIError(e)
    }
  }
}
