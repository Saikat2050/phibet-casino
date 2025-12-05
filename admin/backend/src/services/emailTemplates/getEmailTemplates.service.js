import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { EMAIL_TEMPLATE_EVENT_TYPES } from '@src/utils/constants/public.constants.utils'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    isDefault: { type: 'boolean' },
    searchString: { type: 'string' },
    eventType: { enum: Object.values(EMAIL_TEMPLATE_EVENT_TYPES) },
    page: { type: 'number', minimum: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500 },
    order: { enum: ['asc', 'desc'], default: 'asc' },
    orderBy: { enum: ['id', 'label', 'eventType', 'isDefault'], default: 'id' }
  }
})

export class GetEmailTemplatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { eventType, isDefault, page, perPage, searchString, orderBy, order } = this.args
    const { emailTemplate: EmailTemplateModel } = this.context.sequelize.models

    try {
      const where = {}
      if (eventType) where.eventType = eventType
      if (isDefault) where.isDefault = isDefault
      if (searchString) where.label = { [Op.like]: `%${searchString}%` }

      const emailTemplates = await EmailTemplateModel.findAndCountAll({
        where,
        raw: true,
        ...(page && perPage ? { limit: perPage, offset: (page - 1) * perPage } : {}),
        order: [[orderBy, order]]
      })

      return { emailTemplates: emailTemplates.rows, page, totalPages: Math.ceil(emailTemplates.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
