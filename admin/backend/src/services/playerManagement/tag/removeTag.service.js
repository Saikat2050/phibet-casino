import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    tagId: { type: 'string' },
    userIds: { type: 'array' }
  },
  required: ['userIds', 'tagId']
})

export class RemoveTagService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const tag = await this.context.sequelize.models.tag.findOne({ where: { id: this.args.tagId }, attributes: ['tag'] })
      if (tag.tag === 'INTERNAL') return this.addError('InternalPlayerErrorType')

      const userTag = await this.context.sequelize.models.userTag.destroy({ where: { userId: { [Op.in]: this.args.userIds }, tagId: this.args.tagId } })
      if (!userTag) return this.addError('TagIsNotAttachedErrorType')

      const previousData = {
        userId: this.args.userIds,
        tagId: this.args.tagId
      }

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: this.args.userIds,
        entityType: 'user',
        action: 'delete',
        changeTableId: this.args.tagId,
        changeTableName: 'userTag',
        previousData: { userTag: previousData },
        modifiedData: { userTag: null },
        service: 'removeTag',
        category: tableCategoriesMapping.tags
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
