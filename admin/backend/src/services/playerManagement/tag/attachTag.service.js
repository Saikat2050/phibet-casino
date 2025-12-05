import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    tagId: { type: 'string' },
    userIds: { type: 'array' }
  },
  required: ['tagId', 'userIds']
})

export class AttachTagService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const tagId = this.args.tagId
    const userIds = this.args.userIds

    try {
      const tag = await this.context.sequelize.models.tag.findOne({
        where: { id: tagId, isActive: true }
      })

      if (!tag) return this.addError('TagIsNotAttachedErrorType')

      if (userIds.length > 0) {
        const newUserTags = userIds.map(userId => ({ userId, tagId }))
        await this.context.sequelize.models.userTag.bulkCreate(newUserTags, { updateOnDuplicate: ['updatedAt'] })
      }

      const modifiedData = {
        userIds: userIds,
        tagId: tagId
      }

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: userIds,
        entityType: 'user',
        action: 'create',
        changeTableId: tagId,
        changeTableName: 'user_tags',
        previousData: { userTag: null },
        modifiedData: { userTag: modifiedData },
        service: 'attachTag',
        category: tableCategoriesMapping.user_tags
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
