import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    tagId: { type: 'string' },
    name: { type: 'string' },
    isActive: { type: 'boolean' }
  },
  required: ['tagId']
})

export class UpdateTagService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { name, isActive } = this.args
      const tag = await this.context.sequelize.models.tag.findOne({ where: { id: this.args.tagId } })
      if (!tag || tag.tag === 'INTERNAL') return this.addError('InvalidIdErrorType')

      const tagName = await this.context.sequelize.models.tag.findOne({ where: { tag: { [Op.iLike]: name }, id: { [Op.ne]: this.args.tagId } } })
      if (tagName) return this.addError('TagAlreadyExistErrorType')

      const previousData = tagName.get({ plain: true })
      if (name) tag.tag = name
      if (isActive === true || isActive === false) tag.isActive = isActive

      await tag.save()
      const modifiedData = await this.context.sequelize.models.tag.findOne({ where: { id: this.args.tagId } }, { raw: true })
      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: this.args.tagId,
        entityType: 'tag',
        action: 'update',
        changeTableId: this.args.tagId,
        changeTableName: 'tags',
        previousData: { tag: previousData },
        modifiedData: { tag: modifiedData },
        service: 'removeTag',
        category: tableCategoriesMapping.tags
      })
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
