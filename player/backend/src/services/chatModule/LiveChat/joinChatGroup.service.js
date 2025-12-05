import ServiceBase from '@src/libs/serviceBase'
import { GROUP_CRITERIA } from '@src/utils/constants/public.constants.utils'
import ajv from '@src/libs/ajv'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: ['number'] },
    chatGroupId: { type: ['number'] }
  },
  required: ['userId', 'chatGroupId']
})

export class JoinGroupChatService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      chatGroup: ChatGroupModel,
      user: UserModel,
      userChatGroup: UserChatGroupModel
    } = this.context.sequelize.models
    const transaction = this.context.sequelizeTransaction

    try {
      const { chatGroupId, userId } = this.args

      const userChatGroup = await UserChatGroupModel.findOne({ where: { chatGroupId, userId }, transaction })
      if (userChatGroup) { return this.addError('ThisGroupAlreadyJoinedErrorType') }

      const group = await ChatGroupModel.findOne({ where: { id: chatGroupId }, transaction })
      if (!group) return this.addError('GroupNotExistErrorType')

      const user = await UserModel.findOne({
        where: { id: userId },
        attributes: ['kycStatus'],
        transaction
      })

      for (const criteria of group.criteria) {
        if (criteria.key === GROUP_CRITERIA.KYC_CRITERIA & criteria.value !== user.kycStatus) return this.addError('KycStatusErrorType')
        if (criteria.key === GROUP_CRITERIA.WAGERING_CRITERIA && criteria.value > parseInt(user.scWaggeredAmount)) return this.addError('TotalWagerErrorType')
      }
      await UserChatGroupModel.create({ userId, chatGroupId, isActive: true })

      return { success: true }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
