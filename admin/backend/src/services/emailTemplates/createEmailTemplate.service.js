import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { EMAIL_TEMPLATE_EVENT_TYPES } from '@src/utils/constants/public.constants.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    label: { type: 'string' },
    templateCode: { type: 'string' },
    isDefault: { type: 'boolean', default: false },
    eventType: { enum: Object.values(EMAIL_TEMPLATE_EVENT_TYPES) },
    dynamicData: { type: 'array', default: ['banner_image'] }
  },
  required: ['templateCode', 'eventType']
})

export class CreateEmailTemplatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { label, isDefault, eventType, templateCode, dynamicData } = this.args
    const transaction = this.context.sequelizeTransaction
    const { emailTemplate: EmailTemplateModel } = this.context.sequelize.models

    try {
      if (isDefault) {
        const defaultTemplate = await EmailTemplateModel.findOne({
          where: { eventType, isDefault },
          transaction
        })
        if (defaultTemplate) {
          defaultTemplate.isDefault = false
          await defaultTemplate.save({ transaction })
        }
      }

      const [template, created] = await EmailTemplateModel.findOrCreate({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: { eventType, label },
        defaults: {
          label,
          eventType,
          isDefault,
          templateCode: { EN: templateCode },
          dynamicData: dynamicData
        },
        transaction
      })
      if (!created) return this.addError('EmailTemplateExistWithSameLabelErrorType')

      return { template }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
