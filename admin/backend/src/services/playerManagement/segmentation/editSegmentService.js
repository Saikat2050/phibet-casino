import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { Op } from 'sequelize'
import { requestInputValidation } from '@src/helpers/segmentation.helper'
import RequestInputValidationError from '@src/errors/requestInputValidation.error'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    id: { type: 'number' },
    name: { type: 'string', transform: ['trim'] },
    comments: { type: 'string', transform: ['trim'] },
    condition: {
      type: 'array',
      items: {
        type: 'object'
      }
    }
  },
  required: ['id', 'name', 'comments', 'condition']
})

export class EditSegmentationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      args: { id, name, comments, condition },
      context: {
        models: { segmentation: segmentationModel, tag: tagModel },
        sequelizeTransaction: transaction
      }
    } = this

    try {
      const validateCondition = requestInputValidation(condition)
      if (validateCondition?.length > 0) return new RequestInputValidationError(validateCondition)
      let previousData = null
      if (name) {
        const segment = await segmentationModel.findOne({
          attributes: ['id'],
          where: { name, id: { [Op.ne]: id } },
          transaction
        })
        if (segment) return this.addError('SegmentNameAlreadyExistsErrorType')

        const segmentData = await segmentationModel.findOne({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: { id: { [Op.eq]: id } },
          transaction
        })
        previousData = segmentData.get({ plain: true })

        const tag = await tagModel.findOne({ where: { tag: { [Op.iLike]: segmentData?.name } }, transaction })
        if (tag) await tagModel.update({ tag: name }, { where: { id: tag?.id }, transaction })
      }

      await segmentationModel.update({
        ...(name ? { name } : {}),
        ...(comments ? { comments } : {}),
        ...(condition ? { condition } : {})
      }, { where: { id }, transaction })

      const modifiedData = (await segmentationModel.findOne({ where: { id } })).get({ plain: true })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: id,
        entityType: 'segment',
        action: 'update',
        changeTableId: id,
        changeTableName: 'segmentation',
        previousData: { segment: previousData },
        modifiedData: { segment: modifiedData },
        service: 'EditSegmentationService',
        category: tableCategoriesMapping.segmentation
      })

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
