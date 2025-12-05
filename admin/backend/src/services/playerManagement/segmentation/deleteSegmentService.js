import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    id: { type: 'string' }
  },
  required: ['id']
})

export class DeleteSegmentationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      args: { id },
      context: {
        models: { segmentation: segmentationModel, tag: tagModel },
        sequelizeTransaction: transaction
      }
    } = this

    try {
      const segment = await segmentationModel.findOne({ where: { id }, transaction })
      if (!segment) return this.addError('SegmentDoesNotExistsErrorType')

      const tag = await tagModel.findOne({ where: { tag: { [Op.iLike]: segment.name } }, transaction })
      if (tag) await tagModel.destroy({ where: { id: tag.id }, transaction })
      await segmentationModel.destroy({ where: { id }, transaction })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: id,
        entityType: 'segment',
        action: 'delete',
        changeTableId: id,
        changeTableName: 'segmentation',
        previousData: { segment: segment.get({ plain: true }) },
        modifiedData: { segment: null },
        service: 'DeleteSegmentationService',
        category: tableCategoriesMapping.segment
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
