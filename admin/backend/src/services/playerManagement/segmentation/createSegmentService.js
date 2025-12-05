import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import RequestInputValidationError from '@src/errors/requestInputValidation.error'
import { requestInputValidation } from '@src/helpers/segmentation.helper'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    name: { type: 'string', transform: ['trim'] },
    comments: { type: 'string', transform: ['trim'] },
    condition: {
      type: 'array',
      items: {
        type: 'object'
      }
    }
  },
  required: ['name', 'comments', 'condition']
})

export class CreateSegmentationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      args: { name, comments, condition },
      context: {
        models: {
          segmentation: segmentationModel, tag: tagModel
        },
        sequelizeTransaction: transaction
      }
    } = this

    try {
      const validateCondition = requestInputValidation(condition)
      if (validateCondition?.length > 0) return new RequestInputValidationError(validateCondition)

      const [segment, created] = await segmentationModel.findOrCreate({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { name: { [Op.iLike]: name } },
        defaults: { name, comments, condition },
        transaction
      })
      if (!created) return this.addError('SegmentNameAlreadyExistsErrorType')

      await tagModel.findOrCreate({
        where: { tag: { [Op.iLike]: name } },
        defaults: { tag: name },
        transaction
      })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: segment?.id,
        entityType: 'segment',
        action: 'create',
        changeTableId: segment?.id,
        changeTableName: 'segmentation',
        previousData: { segment: null },
        modifiedData: { segment: segment?.get({ plain: true }) },
        service: 'CreateSegmentationService',
        category: tableCategoriesMapping.segment
      })

      return { success: true, segmentDetail: segment }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
