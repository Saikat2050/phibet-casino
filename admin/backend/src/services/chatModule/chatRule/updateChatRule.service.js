import { ServiceBase } from '@src/libs/serviceBase'
import { SUCCESS_MSG } from '@src/utils/constants/app.constants.js'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    rule: { type: 'string' },
    chatRuleId: { type: 'number' }
  },
  required: ['chatRuleId', 'rule']
})

export default class UpdateChatRuleService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const ChatRuleModel = this.context.sequelize.models.chatRule
    const transaction = this.context.sequelizeTransaction

    const { rule, chatRuleId } = this.args

    const chatRule = await ChatRuleModel.findByPk(chatRuleId)

    if (!chatRule) return this.addError('ThisChatRuleDoesNotExistErrorType')

    const updatedChatRules = await ChatRuleModel.update({ rules: rule }, { where: { id: chatRuleId }, transaction })

    return { message: SUCCESS_MSG.UPDATE_SUCCESS, updatedChatRules }

  }
}
