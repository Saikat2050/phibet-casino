import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    tagId: { type: 'string' }
  },
  required: ['tagId']
})

export class DeleteTagService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const tagId = this.args.tagId
      const tag = await this.context.sequelize.models.tag.findOne({ where: { id: this.args.tagId } })
      if (!tag || tag.tag === 'INTERNAL') return this.addError('InvalidIdErrorType')

      const previousData = tag.get({ plain: true })

      await tag.destroy()

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: tagId,
        entityType: 'tag',
        action: 'delete',
        changeTableId: tagId,
        changeTableName: 'tags',
        previousData: { tag: previousData },
        modifiedData: { tag: null },
        service: 'deleteTag',
        category: tableCategoriesMapping.tags
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
