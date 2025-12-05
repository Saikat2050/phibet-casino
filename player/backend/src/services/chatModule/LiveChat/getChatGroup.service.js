import ServiceBase from '@src/libs/serviceBase'
import ajv from '@src/libs/ajv'
import { Op, Sequelize, literal } from 'sequelize'
import { checkUserCanJoinGroup } from '@src/utils/chat.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    search: { type: 'string', transform: ['trim'] },
    page: { type: 'number', default: 1 },
    perPage: { type: 'number', default: 15 },
    fromDate: { type: 'string' },
    toDate: { type: 'string' },
    userId: { type: 'number' }
  }
})

export class GetChatGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      chatGroup: ChatGroupModel,
      userChatGroup: UserChatGroupModel,
      user: UserModel
    } = this.context.sequelize.models

    try {
      const { perPage, page, search, userId } = this.args
      const where = { status: true }
      if (search) where.name = { [Op.iLike]: `%${search}%` }

      let include = []
      let userDetails
      const attributes = ['id', 'name', 'description', 'status', 'criteria', 'createdAt', 'isGlobal']

      if (userId) {
        userDetails = await UserModel.findOne({ where: { id: userId } })

        include = [{
          model: UserChatGroupModel,
          where: { userId },
          required: false,
          attributes: []
        }]
        attributes.push([literal('CASE WHEN "userChatGroups"."id" IS NOT NULL THEN TRUE ELSE FALSE END'), 'isJoined'])
        where[Op.or] = [Sequelize.where(Sequelize.col('userChatGroups.is_active'), '=', true), Sequelize.where(Sequelize.col('userChatGroups.is_active'), '=', null)]
      }

      const groupDetails = await ChatGroupModel.findAndCountAll({
        where,
        subQuery: false,
        include,
        attributes,
        order: [['id', 'desc']],
        limit: perPage,
        offset: ((page - 1) * perPage)
      })

      if (userId && groupDetails?.rows) {
        groupDetails.rows = groupDetails.rows?.map((group) => {
          group.dataValues.restrictions = checkUserCanJoinGroup(group, userDetails)
          return group
        })
      }

      return { groupDetails: groupDetails.rows || [], page, totalPages: Math.ceil(groupDetails.count / perPage) }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
