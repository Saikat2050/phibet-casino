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
    tag: { type: 'string' },
    isActive: { type: 'boolean' }
  },
  required: ['tag']
})

export class CreateTagService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const tag = this.args.tag
    const isActive = Object.prototype.hasOwnProperty.call(this.args, 'isActive') ? this.args.isActive : true

    try {
      const tagName = await this.context.sequelize.models.tag.findOne({ where: { tag: { [Op.iLike]: tag } } })
      if (tagName) return this.addError('TagAlreadyExistErrorType')

      const newTag = await this.context.sequelize.models.tag.create({ tag, isActive })
      const modifiedData = newTag.get({ plain: true })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: newTag.id,
        entityType: 'tag',
        action: 'create',
        changeTableId: newTag.id,
        changeTableName: 'tags',
        previousData: { tag: null },
        modifiedData: { tag: modifiedData },
        service: 'attachTag',
        category: tableCategoriesMapping.tags
      })

      return { tag: newTag }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
